---
title: 后端端知识点概览
date: 2025-05-27 22:22:32
banner_img: 
index_img: 
categories: 
- 编程学习
---
# 后端知识点概览
为了准备面试，需要系统性的学习后端相关的框架，特此总结一番。

### **一、Java 核心基础**
#### **语言特性**
- **平台无关性**：通过 JVM 实现跨平台，Class 字节码统一执行。
- **面向对象**：封装、继承、多态（动态绑定）、抽象类与接口（接口默认 `static`/`default` 方法，抽象类可定义成员变量）。
- **内存管理**：自动垃圾回收（GC），`finalize()` 方法在对象回收前调用。

#### **关键类与数据结构**
- **String**：`final` 不可变，底层 `char[]`，拼接用 `StringBuilder`（非线程安全）或 `StringBuffer`（线程安全）。
- **集合框架**：
  - **List**：`ArrayList`（底层 `Object[]`，初始容量 10，扩容 1.5 倍）、`LinkedList`（双向链表，适合频繁增删）。
  - **Set**：`HashSet`（哈希表）、`TreeSet`（红黑树，有序）。
  - **Queue**：`Deque`（双端队列，`LinkedList`/`ArrayDeque` 实现）。
- **Map**：`HashMap`（哈希表+链表/红黑树，初始容量 16，负载因子 0.75，扩容 2 倍）、`ConcurrentHashMap`（CAS + 分段锁，线程安全）。

#### **高级特性**
- **泛型**：编译时类型检查，伪泛型（运行时擦除为 `Object`），限定符 `T extends Father`。
- **反射**：运行时动态获取类信息，用于动态代理、AOP、注解解析。
- **多态**：父类引用指向子类对象，通过方法重写实现不同行为。
- **包装类缓存**：`Integer` 缓存 `-128~127`，`new Integer(127)` 与 `Integer.valueOf(127)` 比较为 `false`。


### **二、JVM（Java 虚拟机）**
#### **内存结构**
- **堆**：存储对象实例，分代 GC（Young 区含 Eden/Survivor，Old 区）。
- **方法区**（元空间）：存储类元数据、常量池（`StringPool` 在堆中）。
- **虚拟机栈**：每个线程私有，存储局部变量表、操作数栈。
- **程序计数器**：记录当前线程执行字节码的位置。

#### **类加载机制**
- **流程**：加载（二进制流→`Class` 对象）→ 连接（验证、准备、解析）→ 初始化（执行 `<clinit>` 方法）。
- **双亲委派模型**：避免类重复加载，保证安全性（自定义类加载器需重写 `findClass`）。

#### **垃圾回收（GC）**
- **算法**：标记-清除（碎片）、复制（新生代）、标记-整理（老年代）。
- **回收器**：
  - **Serial**（单线程，Client 模式）、**ParNew**（多线程，配合 CMS）。
  - **CMS**（低停顿，标记-清除，可能产生浮动垃圾）。
  - **G1**（分Region，优先回收价值高的区域，适合大内存）。
- **调优参数**：`-Xms`（堆初始大小）、`-Xmx`（堆最大值）、`-XX:+UseG1GC`。


### **三、JUC（Java 并发包）**
#### **线程与锁**
- **创建线程**：继承 `Thread`、实现 `Runnable`/`Callable`（支持返回值）、线程池（`ThreadPoolExecutor`）。
- **锁机制**：
  - **`synchronized`**：偏向锁→轻量级锁→重量级锁（Monitor 对象），可锁实例/类方法。
  - **`ReentrantLock`**：可重入，支持公平锁、条件变量（`Condition`）。
- **原子变量**：`AtomicInteger`（CAS 实现）、`volatile`（可见性，禁止指令重排）。

#### **并发工具类**
- **AQS（抽象队列同步器）**：`ReentrantLock`/`Semaphore`/`CountDownLatch` 的底层实现，基于双向链表和 `state` 变量。
- **线程池**：
  - **核心参数**：核心线程数、最大线程数、阻塞队列（如 `ArrayBlockingQueue`）、拒绝策略（`AbortPolicy`/`DiscardOldestPolicy`）。
  - **类型**：`FixedThreadPool`（固定线程数）、`CachedThreadPool`（灵活回收线程）。
- **`ThreadLocal`**：线程本地变量，每个线程维护独立副本，避免线程安全问题（需手动 `remove` 防止内存泄漏）。


### **四、Spring 框架**
#### **核心思想**
- **IOC（控制反转）**：对象创建由容器管理，通过 `@Autowired`/`@Resource` 依赖注入。
- **AOP（面向切面编程）**：基于动态代理（JDK/CGLIB），实现日志、事务等功能，切点表达式 `@Pointcut`。

#### **关键组件**
- **Bean 生命周期**：实例化→依赖注入→`BeanPostProcessor`→初始化（`afterPropertiesSet`/`init-method`）→销毁（`destroy-method`）。
- **事务管理**：`@Transactional` 注解，基于 AOP，默认回滚运行时异常。
- **Spring MVC**：DispatcherServlet→HandlerMapping→HandlerAdapter→Controller→视图解析（`@Controller`/`@RestController`）。

#### **高级特性**
- **循环依赖**：通过三级缓存（singletonObjects、earlySingletonObjects、singletonFactories）解决，构造器注入无法处理。
- **自动配置**：`@EnableAutoConfiguration` 扫描 `META-INF/spring.factories` 实现开箱即用。


### **五、MySQL 数据库**
#### **核心特性**
- **存储引擎**：
  - **InnoDB**：支持事务、行锁、外键，聚簇索引（主键索引存储整行数据）。
  - **MyISAM**：不支持事务，表锁，适合读多写少场景。
- **事务隔离级别**：读未提交→读已提交（默认）→可重复读（解决幻读，通过 MVCC）→串行化。

#### **索引与查询优化**
- **索引类型**：主键索引、唯一索引、普通索引、联合索引（最左前缀原则）。
- **执行计划**：`EXPLAIN` 分析 `type`（全表扫描 `all`→索引扫描 `index`→范围查询 `range`→等值查询 `ref`/`eq_ref`）。
- **慢 SQL 优化**：添加覆盖索引、分库分表（水平/垂直拆分）、避免索引失效（如左模糊查询、函数计算）。

#### **锁与日志**
- **锁机制**：
  - **表锁**：元数据锁（MDL）、意向锁（IS/IX）。
  - **行锁**：共享锁（`SELECT ... LOCK IN SHARE MODE`）、排他锁（`SELECT ... FOR UPDATE`）。
- **日志**：
  - **Redo Log**：物理日志，用于崩溃恢复（WAL 机制）。
  - **Bin Log**：逻辑日志，用于主从复制（`Statement`/`Row` 模式）。


### **六、Redis 缓存**
#### **数据结构与应用**
- **String**：计数器（`INCR`）、分布式锁（`SETNX`）。
- **List**：消息队列（`LPUSH`/`RPOP`）、栈结构。
- **Set**：去重、交集/并集（`SADD`/`SMEMBERS`）。
- **ZSet**：排行榜（`ZADD`/`ZRANGE`），底层跳表（SkipList）。
- **Hash**：存储对象（`HSET`/`HGET`）。

#### **核心机制**
- **持久化**：
  - **RDB**：全量快照，适合备份（`SAVE`/`BGSAVE`）。
  - **AOF**：增量日志，安全性高（`appendfsync` 策略）。
- **集群模式**：
  - **主从复制**：异步复制，哨兵（Sentinel）自动故障转移。
  - **分片集群**：哈希槽（16384 个），客户端路由（`CRC16` 算法）。
- **缓存问题**：
  - **穿透**：布隆过滤器（Bloom Filter）拦截无效请求。
  - **击穿**：互斥锁（`Redisson`）或逻辑过期。
  - **雪崩**：随机 TTL、限流（令牌桶）、降级。


### **七、消息中间件**
#### **RabbitMQ**
- **核心概念**：Exchange（路由）、Queue（队列）、Binding（绑定），支持 Direct/Topic/Headers/Fanout 路由模式。
- **可靠性**：生产者确认（`confirm` 机制）、消费者手动 ACK、队列/交换机持久化。
- **延迟队列**：通过 TTL（消息/队列过期时间）+ 死信交换机（DLX）实现。

#### **Kafka**
- **架构设计**：Producer→Topic（分区 Partition）→Broker→Consumer Group（消费者组，分区分配策略）。
- **高性能**：顺序读写、零拷贝（`sendfile`）、批量压缩（`LZ4`/`Snappy`）。
- **可靠性**：分区多副本（ISR 集合）、生产者 `acks` 配置（`0`/`1`/`all`）、消费者手动提交偏移量。


### **八、中间件与工具**
- **Nginx**：反向代理、负载均衡（轮询/加权轮询/IP 哈希）、动静分离、缓存静态资源。
- **JWT**：JSON  Web 令牌，用于身份认证（Header-Payload-Signature），刷新令牌（Refresh Token）机制。
- **分库分表**：水平拆分（按主键取模）、垂直拆分（按业务模块），路由组件（MyCat/Sharding-JDBC）。
- **分布式锁**：Redis `SETNX` + Lua 脚本、Redisson（支持可重入锁/公平锁）、Zookeeper（临时有序节点）。


### **九、网络与操作系统**
#### **网络协议**
- **HTTP**：
  - **1.1**：长连接（`Connection: keep-alive`）、管道化（队头阻塞问题）。
  - **2.0**：二进制帧、多路复用、头部压缩（HPACK）。
  - **3.0**：基于 QUIC 协议，无队头阻塞，1-RTT 握手。
- **TCP/IP**：
  - **三次握手**：SYN→SYN+ACK→ACK，防止历史连接初始化。
  - **四次挥手**：FIN→ACK→FIN→ACK，TIME_WAIT 状态等待 2MSL 确保可靠关闭。

#### **操作系统**
- **进程与线程**：进程是资源分配单位，线程是执行单位，协程（用户态轻量级线程，如 Kotlin Coroutines）。
- **进程通信（IPC）**：管道（匿名/命名）、共享内存（需信号量同步）、消息队列。
- **内存管理**：虚拟内存、分页/分段机制，页面置换算法（LRU/FIFO）。


### **十、设计模式与 AI**
#### **设计模式**
- **创建型**：单例模式（懒汉式/饿汉式/双重检查锁）、工厂模式（简单工厂/工厂方法/抽象工厂）。
- **结构型**：代理模式（静态/动态代理）、装饰器模式（增强对象功能）。
- **行为型**：策略模式（算法封装）、观察者模式（发布-订阅）。

#### **AI 与大模型**
- **注意力机制**：自注意力（Self-Attention，如 Transformer）、交叉注意力（Cross-Attention，编码-解码交互）。
- **Agent 开发**：LangChain（工具调用、Prompt 工程）、AutoGPT（自主决策 Agent）、函数调用（Function Call）。
- **评估指标**：MRR（平均倒数排名）、BLEU（机器翻译）、ROUGE（文本摘要）。

