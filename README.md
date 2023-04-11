## 丁雨医生

## 项目介绍
使用环信 IM  +声网 RTC 共同打造的在线医疗场景解决方案。支持图文、电话、视频问诊，全面覆盖医疗场景下各类问诊形式的需求。典型使用场景包含如：**医院导诊、医院线上问诊、家庭医生1v1视频问诊**等。
此应用基于 uni-app 框架开发，一次开发即可快速实现多端应用。

## 项目说明 
本项目使用HBuilder X 开发
接入环信IM SDK 、声网 RTC SDK

## 运行说明 
本项目使用Android、iOS设备运行
在注册页面注册账号后就能正常登录

## 开发环境 
HBuilder X 3.1.12

### 运行环境 
Android8、iOS9以上

## 运行配置
#### common/agora.config.js 声网配置文件
- "appId":			声网ID（需要替换）
- "token":			声网token（需要替换）
- "channelId":		测试channelId=>自定义（不需要替换）
- "uid":			测试channelId=>自定义（不需要替换）
- "stringUid":		测试channelId=>自定义（不需要替换）

#### common/config.js  网络地址路径

#### utils/WebIMConfig.js 环信配置文件
- appkey:			环信ID （需要替换）


#### 服务端运行
需要全局搜索php服务端，所有涉及到client_id，client_secret，org_name，app_name这四项全部需要替换（最好是全局搜索替换）
```php
 $options['client_id'] = 'YXA61epvIH7aEeaqXJfnedRFiQ';
            $options['client_secret'] = 'YXA6j79LmoNuaMRs78ztKWt_0tOs4_c'; 
            $options['org_name'] = 'comcaesar';
            $options['app_name'] = 'ecchat'; 
```

