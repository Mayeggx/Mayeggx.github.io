---
title: python基础概念学习
date: 2025-05-26 23:53:04
banner_img: 
index_img: 
categories: 
- 编程学习
---
# python基础概念学习

### **一、基础语法**
| **知识点**         | **说明**                                                                 |
|------------------|-----------------------------------------------------------------------|
| **注释**         | - 单行注释：`# 注释内容`<br>- 多行注释：推荐用多行 `#`，或未被使用的三引号字符串（`'''` 或 `"""`，但不推荐） |
| **语句分隔**      | - 一行多条语句：用分号 `;` 分隔（如 `a=1; b=2`）<br>- 多行语句：用 `\` 续行，或括号包裹（`[]`/`{}`/`()`）自动续行 |
| **缩进规则**      | 代码块通过缩进（空格/制表符）区分层级，同一缩进视为一个代码组                          |
| **print 函数**    | - 换行输出：默认行为<br>- 不换行：`print(x, end="")`（Python 3+）                      |
| **字符串表示**    | - 单引号 `'`、双引号 `"`、三引号 `'''`/`"""`（支持多行）                              |


### **二、变量与数据类型**
#### **1. 变量赋值**
- **无需类型声明**：变量动态绑定类型（如 `a = 1`，`a = "string"`）。  
- **多变量赋值**：  
  ```python
  a = b = c = 1       # 多个变量赋同一值
  a, b, c = 1, 2, "john"  # 多变量赋不同值
  ```

#### **2. 标准数据类型**
| **类型**       | **特点**                                                                 | **示例**                          |
|---------------|-------------------------------------------------------------------------|---------------------------------|
| **不可变类型** | 数据修改会创建新对象（`numbers`、`string`、`tuple`）                          | `num = 5; num = 6`（新建对象）           |
| **可变类型**   | 数据修改直接操作原对象（`list`、`dict`）                                        | `lst = [1]; lst.append(2)`（修改原列表）      |

#### **3. 具体类型详解**
- **数字（`numbers`）**：`int`、`float`、`complex`（复数）。  
- **字符串（`string`）**：  
  - 索引：左边界包含，右边界不包含（如 `s = "abc"; s[0:2]` 结果为 `"ab"`）。  
  - 多行字符串：用三引号 `'''` 或 `"""`。  
- **列表（`list`）**：  
  - 支持嵌套，如 `lst = [1, "a", [3, 4]]`。  
  - 截取语法：`lst[start:end:step]`（步长默认 1），如 `lst[1:4:2]`。  
- **元组（`tuple`）**：  
  - 用 `()` 标识，元素不可修改，可重复，如 `tup = (1, 2, 1)`。  
- **字典（`dict`）**：  
  - 无序键值对，键必须为不可变类型（如 `int`、`str`、`tuple`），值可为任意类型。  
  - 操作示例：  
    ```python
    dic = {1: "one", "two": 2}
    dic[2] = "three"  # 添加/更新键值对
    del dic[1]        # 删除键值对
    ```


### **三、运算符**
| **类别**       | **运算符**                          | **说明**                                                                 |
|---------------|-----------------------------------|-------------------------------------------------------------------------|
| **算术运算符**  | `+`、`-`、`*`、`/`、`%`、`**`（幂）、`//`（取整除） | `3 ** 2 = 9`，`7 // 3 = 2`                                           |
| **位运算符**    | `&`（与）、`|`（或）、`^`（异或）、`~`（取反）、`<<`（左移）、`>>`（右移） | `5 ^ 3 = 6`（二进制 `101 ^ 011 = 110`）                               |
| **逻辑运算符**  | `and`、`or`、`not`                   | `True and False = False`                                               |
| **成员运算符**  | `in`、`not in`                      | `2 in [1,2,3] = True`                                                  |
| **身份运算符**  | `is`、`is not`                      | 检查两个对象是否为同一实例（如 `a is b` 判断内存地址是否相同）                |


### **四、流程控制（条件与循环）**
#### **1. 条件语句（`if-elif-else`）**
```python
if condition1:
    # 代码块1
elif condition2:
    # 代码块2
else:
    # 代码块3
```
- 同一行简写：`if var == 100: print("值为100")`。

#### **2. 循环语句**
| **类型**       | **语法**                                                                 | **说明**                                                                 |
|---------------|-------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **`while` 循环** | ```python<br>while condition:<br>    # 循环体<br>else:<br>    # 条件为False时执行<br>``` | `else` 块在循环正常结束（未被 `break` 中断）时执行。                          |
| **`for` 循环**  | ```python<br>for item in iterable:<br>    # 循环体<br>else:<br>    # 循环结束后执行<br>``` | 遍历可迭代对象（如字符串、列表、元组），`else` 块同上。                         |
| **循环控制**    | `break`（退出整个循环）、`continue`（跳过当前迭代）、`pass`（占位符，不执行任何操作） | `pass` 用于避免语法错误（如定义空函数）。                                      |


### **五、函数**
#### **1. 定义与调用**
```python
def function_name(arg1, arg2=默认值, *args, **kwargs):
    """文档字符串（可通过 __doc__ 访问）"""
    # 函数体
    return 返回值
```
- **参数类型**：  
  - **位置参数**：`arg1`（必须按顺序传递）。  
  - **默认参数**：`arg2=默认值`（可选传递）。  
  - **不定长参数**：  
    - `*args`：接收任意数量的位置参数（转为元组）。  
    - `**kwargs`：接收任意数量的关键字参数（转为字典）。  
- **关键字参数**：调用时指定参数名（如 `function_name(arg2=2)`）。

#### **2. 匿名函数（`lambda`）**
```python
sum = lambda x, y: x + y  # 等价于 def sum(x, y): return x + y
```
- 适用于简单函数，无需命名。


### **六、模块与包**
- **导入模块**：  
  ```python
  import module_name          # 导入模块（如 import math）
  from module_name import func # 从模块导入函数（如 from math import sqrt）
  from module_name import *    # 导入模块所有内容（不推荐，可能引发命名冲突）
  ```
- **常用函数**：  
  - `dir(module)`：查看模块中定义的名称（函数、变量等）。  
  - `globals()`/`locals()`：返回全局/局部作用域中的名称字典。  
  - `reload(module)`：重新加载模块（Python 3 需从 `importlib` 导入）。


### **七、输入输出（IO）**
#### **1. 输入函数**
- **`input(prompt)`**：读取用户输入，返回字符串（输入表达式会被求值）。  
- **`raw_input(prompt)`**：Python 2 中的输入函数，等价于 Python 3 的 `input`。

#### **2. 文件操作**
```python
# 打开文件（模式：'r'读，'w'写，'a'追加，'b'二进制模式）
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()     # 读取全部内容
    lines = f.readlines()  # 按行读取为列表
    line = f.readline()    # 读取一行

# 写入文件
with open("file.txt", "w") as f:
    f.write("内容")        # 写入字符串
    f.writelines(["行1\n", "行2\n"])  # 写入列表中的多行
```
- **文件指针操作**：  
  - `f.tell()`：获取当前位置（字节数）。  
  - `f.seek(offset, whence)`：移动指针（`whence=0` 为文件开头，`1` 为当前位置，`2` 为文件末尾）。


### **八、异常处理**
```python
try:
    # 可能引发异常的代码
except ExceptionType as e:  # 捕获特定异常
    # 异常处理逻辑
except:  # 捕获所有异常
    # 通用处理逻辑
else:
    # 无异常时执行
finally:
    # 无论是否异常都会执行（常用于资源释放）
```
- **主动抛出异常**：`raise Exception("错误信息")`。  
- **自定义异常**：继承 `Exception` 类，如 `class MyError(Exception): pass`。


### **九、面向对象编程（OOP）**
#### **1. 类与对象**
```python
class ClassName:
    # 类属性
    class_var = "类变量"
    
    def __init__(self, param):  # 构造方法
        self.instance_var = param  # 实例属性
    
    def method(self):  # 实例方法（必须包含 self 参数）
        print(self.instance_var)
    
    @classmethod
    def class_method(cls):  # 类方法（通过 @classmethod 装饰）
        print(cls.class_var)
    
    @staticmethod
    def static_method():  # 静态方法（无需 self/cls 参数）
        pass
```
- **实例化**：`obj = ClassName("参数")`。  
- **属性访问**：`obj.instance_var`、`ClassName.class_var`。

#### **2. 继承与多态**
```python
class SubClass(ParentClass):  # 单继承
    def __init__(self, param1, param2):
        super().__init__(param1)  # 调用父类构造方法
        self.param2 = param2

class MultiSub(Parent1, Parent2):  # 多继承
    pass
```

#### **3. 访问控制**
| **命名规则**   | **说明**                                                                 |
|---------------|-------------------------------------------------------------------------|
| `_attr`       | 保护属性（约定子类可访问，外部不建议直接访问）。                            |
| `__attr`      | 私有属性（外部不可直接访问，需通过 `obj._ClassName__attr` 访问）。               |
| `__attr__`    | 特殊方法/属性（如 `__init__`、`__str__`，Python 内置）。                       |


### **十、其他重要知识点**
1. **数据类型转换**：  
   - `int(x)`、`float(x)`、`str(x)`、`list(x)`、`tuple(x)`、`dict(x)`。  
2. **解包（Unpacking）**：  
   ```python
   a, b, c = [1, 2, 3]  # a=1, b=2, c=3
   ```
3. **列表推导式**：  
   ```python
   squares = [x**2 for x in range(10)]  # 生成 [0, 1, 4, ..., 81]
   ```
4. **生成器（Generator）**：  
   ```python
   gen = (x for x in range(10))  # 惰性生成序列，节省内存
   ```

### **十一、异步编程（asyncio）**
#### **1. 核心概念**
| **术语**       | **说明**                                                                 |
|---------------|-------------------------------------------------------------------------|
| **协程（Coroutine）** | 由 `async def` 定义的异步函数，可通过 `await` 暂停执行并让出 CPU。               |
| **事件循环（Event Loop）** | 单线程调度器，负责监听和分发异步任务，是异步程序的执行核心。                         |
| **非阻塞IO**    | 允许程序在等待IO操作时继续执行其他任务，提升并发效率。                               |

#### **2. 基础语法**
```python
import asyncio

# 定义协程函数
async def fetch_data(url):
    print(f"开始请求 {url}")
    # 模拟IO操作，让出控制权
    await asyncio.sleep(1)  
    print(f"完成请求 {url}")
    return f"数据: {url}"

# 主函数（也是协程）
async def main():
    # 创建多个协程任务
    task1 = fetch_data("https://api1.com")
    task2 = fetch_data("https://api2.com")
    
    # 并发执行多个任务
    results = await asyncio.gather(task1, task2)
    print(results)

# 启动事件循环
asyncio.run(main())  # Python 3.7+
```

#### **3. 关键机制**
- **await 关键字**：  
  用于暂停协程执行，等待另一个协程或异步操作完成（如 `await func()`）。  
- **任务（Task）**：  
  对协程的封装，可独立调度执行（如 `task = asyncio.create_task(coro())`）。  
- **异步迭代器**：  
  通过 `async for` 和 `__aiter__`/`__anext__` 实现异步迭代（如异步读取文件）。  


### **十二、多线程与多进程**
#### **1. 多线程（threading）**
- **适用场景**：IO密集型任务（如网络请求、文件读写）。  
- **特点**：  
  - 共享全局变量，需通过锁（`threading.Lock`）解决线程安全问题。  
  - 受GIL（全局解释器锁）限制，无法真正并行。  
- **示例**：  
  ```python
  import threading
  
  def worker():
      print("线程执行中")
  
  thread = threading.Thread(target=worker)
  thread.start()
  ```

#### **2. 多进程（multiprocessing）**
- **适用场景**：CPU密集型任务（如科学计算、图像处理）。  
- **特点**：  
  - 每个进程有独立的内存空间，无GIL限制，可真正并行。  
  - 进程间通信需通过 `Queue`、`Pipe` 等方式。  
- **示例**：  
  ```python
  from multiprocessing import Process
  
  def process_task():
      print("进程执行中")
  
  if __name__ == "__main__":
      p = Process(target=process_task)
      p.start()
  ```


### **十三、装饰器（Decorator）**
#### **1. 基本概念**
- **作用**：在不修改原函数代码的情况下，为函数添加额外功能（如日志、计时、权限验证）。  
- **本质**：接收函数作为参数并返回新函数的高阶函数。  

#### **2. 简单示例**
```python
def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        print(f"函数 {func.__name__} 执行耗时: {time.time() - start_time}s")
        return result
    return wrapper

@timer_decorator  # 等价于 func = timer_decorator(func)
def my_function():
    time.sleep(1)

my_function()  # 调用时自动应用装饰器逻辑
```

#### **3. 进阶用法**
- **带参数的装饰器**：通过多层嵌套实现。  
- **类装饰器**：使用类的 `__call__` 方法实现。  


### **十四、迭代器与生成器**
#### **1. 迭代器（Iterator）**
- **协议**：实现 `__iter__()` 和 `__next__()` 方法。  
- **示例**：  
  ```python
  class MyRange:
      def __init__(self, stop):
          self.stop = stop
          self.current = 0
      
      def __iter__(self):
          return self
      
      def __next__(self):
          if self.current < self.stop:
              value = self.current
              self.current += 1
              return value
          raise StopIteration
  
  # 使用迭代器
  for num in MyRange(3):
      print(num)  # 输出 0, 1, 2
  ```

#### **2. 生成器（Generator）**
- **定义方式**：  
  - **生成器函数**：使用 `yield` 关键字（如 `def gen(): yield 1`）。  
  - **生成器表达式**：类似列表推导式，用圆括号（如 `(x for x in range(3))`）。  
- **特点**：惰性求值，节省内存，适用于大数据流处理。  


### **十五、元编程**
#### **1. 动态创建类**
```python
# 使用 type 动态创建类
MyClass = type('MyClass', (object,), {'attr': 1, 'method': lambda self: print('Hello')})

obj = MyClass()
obj.method()  # 输出: Hello
```

#### **2. 元类（Metaclass）**
- **作用**：控制类的创建过程（如验证、修改类属性）。  
- **示例**：  
  ```python
  class Meta(type):
      def __new__(cls, name, bases, attrs):
          # 添加类属性
          attrs['meta_attr'] = 'meta_value'
          return super().__new__(cls, name, bases, attrs)
  
  class MyClass(metaclass=Meta):
      pass
  
  print(MyClass.meta_attr)  # 输出: meta_value
  ```


### **十六、异步IO实战技巧**
#### **1. 异步HTTP请求**
```python
import aiohttp

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, 'https://example.com')
        print(html)
```

#### **2. 异步文件操作**
```python
import aiofiles

async def write_file():
    async with aiofiles.open('test.txt', 'w') as f:
        await f.write('Hello, async!')

async def read_file():
    async with aiofiles.open('test.txt', 'r') as f:
        content = await f.read()
        print(content)
```


### **十七、性能优化**
#### **1. 内置工具**
- **时间分析**：`timeit` 模块测量代码执行时间。  
- **内存分析**：`memory_profiler` 库监控内存使用。  

#### **2. 优化技巧**
- **避免全局变量**：减少命名空间查找开销。  
- **使用生成器**：替代大列表，节省内存。  
- **内置函数优先**：如 `map()`、`filter()` 比纯 Python 循环更高效。  


### **十八、常用标准库**
| **模块**       | **用途**                                                                 |
|---------------|-------------------------------------------------------------------------|
| **os**        | 操作系统接口（文件操作、路径处理）。                                      |
| **sys**       | Python 解释器相关参数（如命令行参数、退出状态）。                          |
| **json**      | JSON 数据解析与序列化。                                                 |
| **re**        | 正则表达式匹配。                                                        |
| **datetime**  | 日期和时间处理。                                                        |
| **logging**   | 日志记录（配置日志级别、输出格式）。                                      |
| **requests**  | HTTP 请求（Python 3 推荐使用 `aiohttp` 实现异步请求）。                  |

