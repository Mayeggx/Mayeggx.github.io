---
title: Golang学习和项目结构分析
date: 2025-05-29 22:18:23
banner_img: 
index_img: 
categories: 
- 编程学习
---
# Golang学习和项目结构分析

### go的语法

#### 下划线的作用
- `import _ "./hello"` 仅仅执行包的init函数，不引入包的其他内容
- `f, _ := os.Open("xxxxxx")` 忽略了错误

#### 变量声明
- `var a int = 1` 类型写在后面
- `var (a int = 1 b int = 2)` 批量声明
- 支持类型推导
- 支持默认值
- `n := 10`在函数内部，可以使用更简略的 := 方式声明并初始化变量
- 匿名变量，哑元变量，即使用下划线
- `const pi = 3.1415` 声明常量
-  iota 是go语言的常量计数器，只能在常量的表达式中使用

#### 数据类型
- rune 是int32的别名，用于表示unicode字符
- uintptr 是无符号整数类型，用于存储指针的地址
- string 以原生数据类型出现，使用字符串就像使用其他原生数据类型 
  - 示例 `s1 := "hello"`
  - 要修改字符串，需要先将其转换成[]rune或[]byte，完成后再转换为string
- array 是值类型，长度固定
- struct 是值类型，字段可以是不同类型
- slice 是引用类型，长度可变
- map 是引用类型，键值对集合
- channel 是引用类型，用于协程之间的通信
- interface 是引用类型，用于实现多态
- func 是引用类型，用于表示函数
- `T(表达式)` 类型转换：Go语言中只有强制类型转换，没有隐式类型转换

#### Array
- 数组长度必须是常量，且是类型的组成部分。一旦定义，长度不能变
- 长度是数组类型的一部分，因此，`var a[5]` int和`var a[10]int`是不同的类型
- 数组是值类型，赋值和传参会复制整个数组，而不是指针。因此改变副本的值，不会改变本身的值
- 指针数组 `[n]*T`，数组指针 `*[n]T`
- 数组的初始化，可以指定长度，可以不指定，可以类型推断
  - `var arr0 [5]int = [5]int{1, 2, 3}`
  - `var arr2 = [...]int{1, 2, 3, 4, 5, 6}`

#### 切片Slice
- slice 并不是数组或数组指针。它通过内部指针和相关属性**引用数组片段**
- `var s1 []int`在 Go 语言里，数组和切片是不同的数据结构，差异主要体现在长度是否固定
- `make([]T, len, cap)` make 函数创建一个切片
  - T：切片中元素的类型。 
  - len：切片的初始长度，即切片中当前元素的数量。 
  - cap：切片的初始容量，即底层数组的大小，该参数是可选的。若省略，cap 会默认等于 len。
- `s6 = arr[1:4]`从数组切片
- `p := &s[2]` 获取底层数组元素指针
- `c := append(a, b...)` 向 slice 尾部添加数据，返回新的 slice 对象
- `s := data[:2:3]`切片的第三个数字代表容量max。对比make构造的方法，此时`cap = max - low`，`lenght = high - low`
- 超出原 slice.cap 限制，就会重新分配底层数组。通常以 2 倍容量重新分配底层数组。
- `copy(s2, s1)`函数 copy 在两个 slice 间复制数据，**复制长度以 len 小的为准**
- `s3 = append(s3, s2...)`将s2的元素展开，一个个append到s3后面
- `for index, value := range slice`遍历slice，`for range`是一种专门的遍历结构
#### 指针
- 区别于C/C++中的指针，Go语言中的指针不能进行偏移和运算，是安全指针
- Go语言中的函数传参都是值拷贝，当我们想要修改某个变量的时候，我们可以创建一个指向该变量地址的指针变量
- ` ptr := &v `ptr:用于接收地址的变量，ptr的类型就为*T，称做T的指针类型。*代表指针。
-  取地址操作符&和取值操作符*是一对互补操作符，&取出地址，*根据地址取出地址指向的值
- 通过指针传递值
```golang
func modify2(x *int) {
    *x = 100
}

func main() {
    a := 10
    modify1(a)
    fmt.Println(a) // 10
    modify2(&a)
    fmt.Println(a) // 100
}
```
- `if p != nil`空指针
- `var a *int; *a = 100`对于引用类型的变量，不能直接使用等号赋值，需要使用new函数分配内存空间，才能进行赋值操作
- `a := new(int)`得到一种类型的指针
- ` b = make(map[string]int, 10)` 区别于new，它只用于slice、map以及chan的内存创建.它返回的类型就是这三个类型本身，而不是他们的指针类型，因为这三种类型就是引用类型.
#### Map

- ` b = make(map[string]int, 10)` 声明方法
- `userInfo := map[string]string{"username": "pprof.cn", "password": "123456", }` 初始化
- `v, ok := scoreMap["张三"]` 判断存在
- `delete(scoreMap, "张三")` 删除
#### 结构体

- Go语言中没有“类”的概念，也不支持“类”的继承等面向对象的概念
- `type MyInt int` 自定义类型
- ` type TypeAlias = Type` 定义别名
- ` type person struct { name string city string age int8 }` 结构体定义
- `var p1 person` 结构体实例化
- `var user struct{Name string; Age int}` 匿名结构体
- `var p2 = new(person);p2.name = "测试"` 创建指针实现实例化，使用结构体指针来访问成员
- `p3 := &person{};p3.name = "测试"` 取地址符实例化
- `p5 := person{ name: "pprof.cn", city: "北京", age:  18,}` 结构体实例化
- `func newPerson(name, city string, age int8) *person `Go语言的结构体没有构造函数，我们可以自己实现
- 方法（Method）是一种和特定类型结构绑定在一起。这种特定类型变量叫做接收者（Receiver）
- `func (p person) Dream() { fmt.Printf("%s的梦想是学好Go语言！\n", p.Name) }` 方法
- 指针类型的接收者由一个结构体的指针组成，由于指针的特性，在方法结束后，修改都是有效的。这种方式就十分接近于其他语言中面向对象中的this或者self
- `type Person struct { string; int; }` 结构体的匿名字段，只指定类型，不指定字段
- `type Dog struct { Feet    int8; *Animal; }`通过嵌套匿名结构体实现继承,这意味着 Dog 类型会提升 Animal 结构体的所有方法
- 可见性：结构体中字段大写开头表示可公开访问，小写表示私有
- `data, err := json.Marshal(c)`序列号和反序列化
- Tag在结构体字段的后方定义，由一对反引号包裹起来
- 通过指定tag实现json序列化该字段时的key，例如`json:"name"`表示序列化时，该字段的key为name
- `type Stack[T any] struct ` 泛类型参数

#### 泛类型参数

### 面向对象

#### 接口

- golang的接口是**隐式的**，只要其他的类型实现了接口的所有方法，那么这个类型就实现了这个接口
- 在传入一个类型的数据时，此时只需要指定接口类型，而不需要指定具体的类型，提高了代码的灵活性
```golang
// 定义接口
type Shape interface {
    Area() float64
    Perimeter() float64
}

type Rectangle struct { Width, Height float64 }
type Circle struct { Radius float64 }

func (r Rectangle) Area() float64      { return r.Width * r.Height }
func (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }

func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

// 统一的计算函数 - 接受接口类型
func CalculateArea(s Shape) float64 { return s.Area() }
func CalculatePerimeter(s Shape) float64 { return s.Perimeter() }
```
- `var any interface{}`空接口可以存储任意类型的值，常用于动态类型场景
```golang
//利用空接口简化类型判断
func processValue(v interface{}) {
    switch val := v.(type) {
    case int:
        fmt.Println("整数:", val)
    case string:
        fmt.Println("字符串:", val)
    case []int:
        fmt.Println("整数切片:", val)
    default:
        fmt.Println("未知类型")
    }
}
```


### 常用数据库

#### 反射
- 反射是指在程序运行期对程序本身进行访问和修改的能力
- reflect包封装了反射相关的方法
- ` v := reflect.ValueOf(a)`反射获取值
- `t := reflect.TypeOf(a)` 反射获取类型
- `v.SetFloat(6.9)`修改反射的值

### 并发编程

#### Goroutine
- 协程是轻量级的线程，由Go语言的运行时（runtime）调度。
- 协程的调度由Go语言的运行时（runtime）负责，开发者无需手动管理协程的调度。
- goroutine是官方实现的超级线程池，通过通信共享内存
- `go hello()`当你需要让某个任务并发执行的时候，你只需要把这个任务包装成一个函数，开启一个goroutine去执行这个函数就可以了
- `time.Sleep(time.Second)` main函数上会创建一个默认的gorountine，main函数结束后，默认的gorountine也会结束
- 可增长的栈：goroutine的栈在其生命周期开始时很小，并且随着程序的执行，栈会逐渐增长，直到达到一个上限。这个上限是由Go语言的运行时（runtime）决定的，通常是2MB。
- GPM调度：
#### runtime包
- ` runtime.Gosched()`让出CPU时间片，重新等待安排任务
- `runtime.Goexit()`退出当前协程
- `runtime.GOMAXPROCS`确定需要使用多少个OS线程来同时执行Go代码
#### Channel
- Go语言的并发模型是`CSP（Communicating Sequential Processes）`，提倡通过通信共享内存而不是通过共享内存而实现通信。
- 通道像一个传送带或者队列，总是遵循先入先出的规则，保证收发数据的顺序
- `var ch3 chan []int`声明一个传递int切片的通道
- `ch6 := make(chan []int)` 引用类型需要make初始化之后才能使用
- `ch <- 10`把10发送到ch中
- `x := <- ch`从ch中接收值并赋值给变量x
- `ch := make(chan int)`无缓冲的通道只有在有人接收值的时候才能发送值
- 使用同步通道的方法
```golang
func recv(c chan int) {
	ret := <-c
	fmt.Println("接收成功", ret)
}
func main() {
	ch := make(chan int)
	go recv(ch) // 启用goroutine从通道接收值
	ch <- 10
	fmt.Println("发送成功")
}
```
- `ch := make(chan int, 1)`创建有缓存的通道，容量为1
#### 定时器

- `timer5 := time.NewTimer(3 * time.Second)` 时间到了，执行只执行1次
- `ticker := time.NewTicker(1 * time.Second)`时间到了，多次执行

#### select多路复用

实现多路复用
```golang
   // 2个管道
   output1 := make(chan string)
   output2 := make(chan string)
   // 跑2个子协程，写数据
   go test1(output1)
   go test2(output2)
   // 用select监控
   select {
   case s1 := <-output1:
      fmt.Println("s1=", s1)
   case s2 := <-output2:
      fmt.Println("s2=", s2)
   }
```
#### 并发安全和锁

- `lock.Lock()`Go语言中使用sync包的Mutex类型来实现互斥锁
- `rwlock.Lock()`加写锁
- ` rwlock.RLock() `加读锁

#### Sync

- `sync.WaitGroup`内部维护着一个计数器，计数器的值可以增加和减少
- `wg.Add()`计数器加1
- `wg.Done()`计数器减1
- `wg.wait()` 阻塞直到计数器变为0
- `sync.Once` 用于实现单例模式，保证一个函数只被执行一次
- `var m = sync.Map{}` 并发安全的map

#### 原子操作
#### GMP调度原理
### gin框架

- Gin是一个golang的微框架，封装比较优雅，API友好
- hello world ![img.png](img.png)

#### gin的路由

- `router.go`中，会遍历所有的路由，注册到`routerGroup`中

### go的结构相关知识
- `go.sum`记录了模块的哈希值，精确锁定所有的依赖，保证依赖的一致性
- `go.sum`由go的工具链自动生成
- `envcofig`利用go语言的泛着，便利结构体的字段，根据`envconfig`中的环境变量名找到对应的值
- `main.go`调用`Install`函数注册路由器组件，创建每个模块的前缀


### 项目结构
- `core/cache` 基于 Redis 的缓存操作
- `core/ctx` 用于组织上下文相关的代码
- `core/mysql`
- `core/oss`
