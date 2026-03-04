#!/usr/bin/expect -f
# CyberPress 部署上传脚本 (Expect 版本)
# 用途：使用 Expect 处理密码认证

set timeout 60

# 配置信息
set deploy_host "43.139.128.127"
set deploy_user "ubuntu"
set deploy_password "Wyq20031110?"

# 查找最新的打包文件
set package [exec bash -c "ls -t /root/.openclaw/workspace/cyberpress-platform/deploy/cyberpress_*.tar.gz 2>/dev/null | head -1"]
set package_name [file tail $package]

puts "\033\[0;32m========================================\033\[0m"
puts "\033\[0;32mCyberPress 上传工具 (Expect)\033\[0m"
puts "\033\[0;32m========================================\033\[0m"
puts ""
puts "\033\[1;33m服务器: $deploy_host\033\[0m"
puts "\033\[1;33m用户: $deploy_user\033\[0m"
puts "\033\[1;33m文件: $package_name\033\[0m"
puts ""

# 创建远程目录
puts "\033\[1;33m创建远程目录...\033\[0m"
spawn ssh -o StrictHostKeyChecking=no $deploy_user@$deploy_host "mkdir -p ~/deploy"
expect {
    "password:" {
        send "$deploy_password\r"
        expect eof
    }
    eof
}

# 上传文件
puts "\033\[1;33m上传文件...\033\[0m"
spawn scp -o StrictHostKeyChecking=no $package $deploy_user@$deploy_host:~/deploy/
expect {
    "password:" {
        send "$deploy_password\r"
        expect {
            "100%" {
                puts "\033\[0;32m上传成功！\033\[0m"
            }
            timeout {
                puts "\033\[0;31m上传超时\033\[0m"
            }
        }
    }
    eof
}

puts ""
puts "\033\[0;32m========================================\033\[0m"
puts "\033\[0;32m上传完成！\033\[0m"
puts "\033\[0;32m========================================\033\[0m"
puts ""
puts "文件已上传到: \033\[1;33m~/deploy/$package_name\033\[0m"
puts ""
