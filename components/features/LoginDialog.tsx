'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: { username: string; email: string }) => void;
}

type ViewMode = 'auth' | 'forgot-password' | 'verify-code' | 'reset-password';

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('auth');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetPasswordForm, setResetPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [sentCode, setSentCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 验证输入
    if (!loginForm.username || !loginForm.password) {
      setError('请填写完整的用户名和密码');
      setLoading(false);
      return;
    }

    // 模拟登录 API 调用
    setTimeout(() => {
      // 这里应该调用真实的 API，目前使用模拟验证
      if (loginForm.password.length >= 6) {
        onLogin({
          username: loginForm.username,
          email: `${loginForm.username}@example.com`
        });
        setSuccess('登录成功！');
        setTimeout(() => {
          onOpenChange(false);
          setLoginForm({ username: '', password: '' });
          setSuccess('');
        }, 1000);
      } else {
        setError('密码长度至少为 6 位');
      }
      setLoading(false);
    }, 800);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 验证输入
    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setError('请填写所有字段');
      setLoading(false);
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email)) {
      setError('请输入有效的邮箱地址');
      setLoading(false);
      return;
    }

    // 验证密码
    if (registerForm.password.length < 6) {
      setError('密码长度至少为 6 位');
      setLoading(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    // 模拟注册 API 调用
    setTimeout(() => {
      setSuccess('注册成功！正在登录...');
      setTimeout(() => {
        onLogin({
          username: registerForm.username,
          email: registerForm.email
        });
        onOpenChange(false);
        setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
        setSuccess('');
      }, 1000);
      setLoading(false);
    }, 800);
  }

  function handleSendResetCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setError('请输入有效的邮箱地址');
      setLoading(false);
      return;
    }

    // 模拟发送验证码 API 调用
    setTimeout(() => {
      // 生成 6 位随机验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);
      setSuccess(`验证码已发送到 ${forgotPasswordEmail}（演示模式：${code}）`);
      
      setTimeout(() => {
        setViewMode('verify-code');
        setSuccess('');
      }, 2000);
      
      setLoading(false);
    }, 1000);
  }

  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!verificationCode) {
      setError('请输入验证码');
      setLoading(false);
      return;
    }

    // 模拟验证码验证
    setTimeout(() => {
      if (verificationCode === sentCode) {
        setSuccess('验证成功！');
        setTimeout(() => {
          setViewMode('reset-password');
          setSuccess('');
        }, 1000);
      } else {
        setError('验证码错误，请重新输入');
      }
      setLoading(false);
    }, 800);
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 验证密码
    if (resetPasswordForm.password.length < 6) {
      setError('密码长度至少为 6 位');
      setLoading(false);
      return;
    }

    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    // 模拟重置密码 API 调用
    setTimeout(() => {
      setSuccess('密码重置成功！正在返回登录...');
      setTimeout(() => {
        // 重置所有状态
        setViewMode('auth');
        setActiveTab('login');
        setForgotPasswordEmail('');
        setVerificationCode('');
        setResetPasswordForm({ password: '', confirmPassword: '' });
        setSentCode('');
        setSuccess('');
      }, 1500);
      setLoading(false);
    }, 800);
  }

  function resetToAuth() {
    setViewMode('auth');
    setError('');
    setSuccess('');
    setForgotPasswordEmail('');
    setVerificationCode('');
    setResetPasswordForm({ password: '', confirmPassword: '' });
    setSentCode('');
  }

  function handleDialogChange(isOpen: boolean) {
    if (!isOpen) {
      // 对话框关闭时，重置所有状态到初始登录页面
      resetToAuth();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        {viewMode === 'auth' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">欢迎使用 MRM Method Builder</DialogTitle>
              <DialogDescription>
                登录以保存您的方法配置和访问更多功能
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">用户名</Label>
                    <Input
                      id="login-username"
                      placeholder="请输入用户名"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="请输入密码"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '登录中...' : '登录'}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm" 
                      type="button"
                      onClick={() => setViewMode('forgot-password')}
                    >
                      忘记密码？
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">用户名</Label>
                    <Input
                      id="register-username"
                      placeholder="请输入用户名"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">邮箱</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="请输入邮箱地址"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="至少 6 位字符"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">确认密码</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="再次输入密码"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '注册中...' : '注册'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </>
        ) : viewMode === 'forgot-password' ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={resetToAuth}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-2xl font-bold">忘记密码</DialogTitle>
              </div>
              <DialogDescription>
                输入您注册时使用的邮箱地址，我们将发送验证码
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendResetCode} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="请输入邮箱地址"
                    className="pl-10"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '发送中...' : '发送验证码'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm" 
                  type="button"
                  onClick={resetToAuth}
                >
                  返回登录
                </Button>
              </div>
            </form>
          </>
        ) : viewMode === 'verify-code' ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('forgot-password')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-2xl font-bold">验证邮箱</DialogTitle>
              </div>
              <DialogDescription>
                验证码已发送到 {forgotPasswordEmail}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleVerifyCode} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="verify-code">验证码</Label>
                <Input
                  id="verify-code"
                  placeholder="请输入 6 位验证码"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-gray-500 text-center">
                  验证码有效期为 10 分钟
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '验证中...' : '验证'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm" 
                  type="button"
                  onClick={() => {
                    setViewMode('forgot-password');
                    setVerificationCode('');
                  }}
                >
                  重新发送验证码
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">重置密码</DialogTitle>
              <DialogDescription>
                请输入您的新密码
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="至少 6 位字符"
                  value={resetPasswordForm.password}
                  onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, password: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">确认新密码</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="再次输入新密码"
                  value={resetPasswordForm.confirmPassword}
                  onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, confirmPassword: e.target.value })}
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '重置中...' : '重置密码'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

