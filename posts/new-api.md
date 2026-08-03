---
title: new-api项目解析
date: 2025-05-29 22:18:23
banner_img: 
index_img: 
categories: 
- 编程学习
---

# new-api 项目架构分析

### 总架构

- main.go
  - 加载环境变量和配置文件。
  - 初始化数据库，主数据库、日志数据库、SR数据库
  - 初始化redis
  - 设置环境相关常量，初始化工作流、选项映射和内存缓存，启动后台应用
  - 启用性能监控，初始化服务组件InitTokenEncoders
  - 启动http服务器
- web-router.go
  - gzip：使用 Gzip 压缩中间件，对 HTTP 响应进行压缩，提升传输效率。
  - GlobalWebRateLimit：全局速率限制中间件，用于限制 Web 请求的频率，防止滥用。
  - Cache：缓存中间件，用于优化性能。
  - 使用 static.Serve 提供静态资源服务，将 web/dist 目录中的文件嵌入到应用中，供前端访问
  - 对于未匹配的路由（如 /v1、/api、/assets 开头的路径），调用 controller.RelayNotFound 处理。

---

### custom

##### 费用计算

`calculate/cost` ->  `CalculateCost`

- 流程
  1. 

##### 获取费用

`cost` ->  `GetCost` 传入data

- 流程
  1. 获取日期，如果没有日期设置为前一天
  2. 删除该日期已存在的成本记录
  3. 

---

### openapi

##### 创建令牌

`token` -> `OpenApiAddToken`

- 流程
  1. 声明`token`，使用ShouldBindJSON将请求体绑定到`token`结构体。json中传入的字段包括name、work_id、space_id。
  2. 调用`common.GenerateKey()`生成一个唯一的密钥key(这个函数进行len次循环，每次从`keyChars`中随机取出一个字母)
  3. 调用`oa.GetDeptByUserID(token.WorkId)`获取用户部门信息，传入deptInfo
  4. `uniconfig.GetConfigValue(uniconfig.DefaultEnabledModelKey)`获取默认的模型列表
  5. 构建完整的token对象`cleanToken`，传入上述步骤中获取的字段，设置时间戳、分组、配额等。
  6. 调用`cleanToken.Insert()`将token保存到数据库。
  7. 成功返回`"message": "sk-" + cleanToken.Key`添加"sk-"前缀的完整Token。

- tips
  - `ShouldBindJSON`：将请求体绑定到结构体，自动处理JSON解析和验证。

##### 工单回调-通过工作流系统创建api令牌

`wf/key` -> `OpenApiAddTokenByWorkflow`

- 流程
  1. 读取原始的请求体到 `requestBody`，并重新设置请求体保证可以重复读取。
  2. 定义`workflowRequest`的数据结构，并将请求映射到结构体。请求中有绝大部分的字段，但是没有`KeyType 、Uk 、Privac、BusinessScenario`
  3. 生成key
  4. 根据privacy字段确定，令牌的分组group是cloud还是local
  5. 获取系统配置
  6. 构建令牌对象token，存到数据库中
  7. 调用通知服务`workflowController.SendNotification()`，告知生成的令牌
  8. 返回code=0表示生成成功

##### 追加默认模型

`update/default/models` -> `UpdateTokenModelLimits`

- 流程
  1. 获取默认的模型列表`uniconfig.GetConfigValue(uniconfig.DefaultEnabledModelKey)`
  2. 查询所有的Token记录`model.DB.Find(&tokens)`
  3. 遍历tokens，获取token中的ModelLimits字段，并返回一个字符串切片，如`[]string{"gpt-4", "llama2", "claude"}`
  4. 将字符串切片中的对应的模型保存在map中`currentModels[model] = true`
  5. 将`defaultEnabledModelKey`中的模型保存在map中，如果更新过，则将update置为true
  6. 将currentModels转为字符串存储到`newModels`中
  7. 将字符串切片连接成一个字符串，然后保存`token.ModelLimits`，执行`token.Update()`
  8. 使用select显式的指定需要更新的字段，再使用update更新`model_limits`字段。异步开启协程更新缓存。

- tips
  - `for key := range mapName`仅仅表示按键遍历map，而忽略value
  - `DB.Model(token)`指定操作的数据库表（通过 Go 结构体映射）
  - 对象关系映射机制ORM，开发者定义 Go 结构体，GORM 自动将其映射为数据库表，在定义model的struct时这只gorm即可。