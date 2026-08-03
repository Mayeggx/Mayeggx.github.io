---
title: K8S框架的学习
date: 2025-06-04 23:42:32
banner_img: 
index_img: 
categories: 
- 编程学习
---
# K8S框架的学习

### **Kubernetes 核心知识点总结**

#### **一、基本组件**
1. **容器编排引擎**  
   - 自动化部署、扩展和管理容器化应用。

2. **Node（节点）**  
   - 物理机或虚拟机，运行 Pod。

3. **Pod**  
   - 最小部署单元，可包含多个容器，IP 动态变化。

4. **Service**  
   - 为 Pod 提供固定访问入口，类型包括：  
     - **内部服务**：ClusterIP（集群内访问）。  
     - **外部服务**：NodePort（节点端口转发）、LoadBalancer（云负载均衡）、Ingress（统一入口，支持证书和负载均衡）。

5. **配置与存储**  
   - **ConfigMap**：存储非敏感配置，解耦应用与配置。  
   - **Secret**：存储敏感信息（Base64 编码）。  
   - **Volume**：实现容器数据持久化。

6. **控制器**  
   - **Deployment**：无状态应用管理，支持副本控制、滚动更新、自动恢复。  
   - **StatefulSet**：有状态应用管理（如数据库），保留状态信息。


#### **二、Node 结构**
1. **Worker Node**  
   - **Container Runtime**：拉取镜像并运行容器（如 Docker）。  
   - **Kubelet**：管理节点上的 Pod。  
   - **Kube-Proxy**：实现网络代理和负载均衡。

2. **Master Node**  
   - **API Server**：集群统一入口，处理资源操作。  
   - **Scheduler**：调度 Pod 到合适节点。  
   - **Controller Manager**：维护资源状态。  
   - **etcd**：存储集群状态数据。  
   - **Cloud Controller Manager**：与云平台 API 交互。


#### **三、环境搭建**
- **Minikube**：单节点本地环境，通过 `kubectl` 交互。  
- **Multipass + k3s**：轻量级多节点集群。  
- **KillerCoda**：在线交互式 K8s 环境。


#### **四、常用命令**
```bash
# 资源查看
kubectl get nodes/svc/pod

# 创建资源
kubectl run nginx --image=nginx
kubectl create deployment nginx --image=nginx

# 管理资源
kubectl edit deployment nginx  # 修改副本数
kubectl logs pod-name          # 查看日志
kubectl exec -it pod-name -- /bin/bash  # 进入容器

# 配置文件操作
kubectl create/apply/delete -f xxx.yaml
```


#### **五、YAML 配置文件**
```yaml
apiVersion: apps/v1       # API 版本
kind: Deployment          # 资源类型
metadata:
  name: nginx-deployment  # 名称
spec:
  replicas: 3             # 副本数
  selector: ...           # 选择器
  template: ...           # Pod 模板
```


#### **六、外部服务配置**
- **Service 配置**：  
  ```yaml
  spec:
    selector:             # 关联 Pod
    ports:
      - port: 80          # 对外端口
        targetPort: 8080  # 容器端口
    type: NodePort        # 服务类型
  ```
- **命名空间操作**：  
  ```bash
  kubectl get ns          # 查看命名空间
  ```
- **图形界面部署**：  
  ```bash
  kubectl apply -f portainer.yaml  # 部署 Portainer
  ```