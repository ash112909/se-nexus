function render_login(el) {
  el.style.height = '100vh';
  el.innerHTML = `
<style>
.login-root { display: flex; height: 100vh; min-height: 620px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; width: 100%; }
.login-left { width: 52%; background: #1E1E1E; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 56px; position: relative; overflow: hidden; }
.login-texture { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 52px 52px; pointer-events: none; }
.login-glow { position: absolute; bottom: -80px; left: -60px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 65%); pointer-events: none; }
.fleet-logo-area { position: relative; z-index: 1; }
.fleet-logo-lockup { display: flex; align-items: center; gap: 14px; }
.fleet-logo-icon { width: 52px; height: 52px; background: #F5A623; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.fleet-name { display: flex; flex-direction: column; gap: 2px; }
.fleet-name-primary { font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1.1; }
.fleet-name-secondary { font-size: 13px; color: #6B7080; font-weight: 400; }
.login-center { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.login-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #F5A623; margin-bottom: 18px; }
.login-headline { font-size: 36px; font-weight: 700; color: #FFFFFF; line-height: 1.2; letter-spacing: -0.7px; margin-bottom: 16px; }
.login-sub { font-size: 15px; color: #6B7080; line-height: 1.7; max-width: 340px; }
.login-footer { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; }
.powered-by-text { font-size: 12px; color: #3C4052; }
.se-wordmark { display: flex; align-items: center; gap: 4px; }
.se-wordmark-icon { width: 16px; height: 16px; }
.se-wordmark-text { font-size: 13px; font-weight: 600; }
.se-wordmark-text span:first-child { color: #666C7E; }
.se-wordmark-text span:last-child { color: #F5A623; }
.login-right { width: 48%; background: #F5F2EE; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 48px 56px; }
.login-form-wrap { width: 100%; max-width: 360px; }
.login-form-header { margin-bottom: 32px; }
.login-form-title { font-size: 22px; font-weight: 700; color: #111318; letter-spacing: -0.4px; margin-bottom: 5px; }
.login-form-sub { font-size: 14px; color: #7A7F8E; }
.login-field { margin-bottom: 16px; }
.login-label { display: block; font-size: 13px; font-weight: 500; color: #3A3D4A; margin-bottom: 6px; }
.login-input-wrap { position: relative; }
.login-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #B0AAA3; font-size: 16px; pointer-events: none; }
.login-input { width: 100%; height: 44px; padding: 0 14px 0 38px; background: #FFFFFF; border: 1.5px solid #E2DDD8; border-radius: 10px; font-size: 14px; font-family: inherit; color: #111318; outline: none; transition: border-color 0.15s; }
.login-input:focus { border-color: #F5A623; box-shadow: 0 0 0 3px rgba(245,166,35,0.12); }
.login-input::placeholder { color: #C0BAB3; }
.login-eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #B0AAA3; font-size: 16px; padding: 0; display: flex; align-items: center; }
.login-meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
.login-check-label { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #5A5F6E; cursor: pointer; }
.login-check-label input { accent-color: #F5A623; cursor: pointer; }
.login-forgot { font-size: 13px; color: #C08A1A; font-weight: 500; text-decoration: none; }
.login-forgot:hover { text-decoration: underline; }
.btn-sign-in { width: 100%; height: 46px; background: #F5A623; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: inherit; color: #1A1200; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 18px; transition: background 0.15s; }
.btn-sign-in:hover { background: #E8980F; }
.login-divider { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.login-divider-line { flex: 1; height: 1px; background: #E2DDD8; }
.login-divider-text { font-size: 12px; color: #B0AAA3; }
.btn-sso-login { width: 100%; height: 42px; background: #FFFFFF; border: 1.5px solid #E2DDD8; border-radius: 10px; font-size: 13px; font-weight: 500; font-family: inherit; color: #3A3D4A; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px; margin-bottom: 28px; transition: border-color 0.15s; }
.btn-sso-login:hover { border-color: #C8C3BC; }
.login-form-footer { text-align: center; font-size: 12px; color: #ABA6A0; line-height: 1.7; }
.login-form-footer a { color: #C08A1A; text-decoration: none; }
.login-form-footer a:hover { text-decoration: underline; }
</style>

<div class="login-root">
  <div class="login-left">
    <div class="login-texture"></div>
    <div class="login-glow"></div>
    <div class="fleet-logo-area">
      <div class="fleet-logo-lockup">
        <div class="fleet-logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 20 L14 8 L22 20" stroke="#1A1200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="14" cy="21" r="2.5" fill="#1A1200"/>
          </svg>
        </div>
        <div class="fleet-name">
          <div class="fleet-name-primary">Mid-County Rental</div>
          <div class="fleet-name-secondary">&amp; Sales</div>
        </div>
      </div>
    </div>
    <div class="login-center">
      <div class="login-eyebrow">Fleet Portal</div>
      <h1 class="login-headline">Your fleet,<br>ready to roll.</h1>
      <p class="login-sub">Parts, work orders, and diagnostics &mdash; all in one place for your team.</p>
    </div>
    <div class="login-footer">
      <span class="powered-by-text">Powered by</span>
      <div class="se-wordmark">
        <svg class="se-wordmark-icon" viewBox="0 0 16 16" fill="none">
          <rect width="16" height="16" rx="4" fill="#2A2A2A"/>
          <path d="M4 11 L8 5 L12 11" stroke="#F5A623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <circle cx="8" cy="11.5" r="1.2" fill="#F5A623"/>
        </svg>
        <div class="se-wordmark-text"><span>Smart</span><span>Equip</span></div>
      </div>
    </div>
  </div>

  <div class="login-right">
    <div class="login-form-wrap">
      <div class="login-form-header">
        <div class="login-form-title">Sign in</div>
        <div class="login-form-sub">Enter your credentials to access your account</div>
      </div>

      <div class="login-field">
        <label class="login-label" for="login-username">Username</label>
        <div class="login-input-wrap">
          <i class="ti ti-user login-input-icon" aria-hidden="true"></i>
          <input class="login-input" id="login-username" type="text" placeholder="Your username" autocomplete="username"/>
        </div>
      </div>

      <div class="login-field">
        <label class="login-label" for="login-password">Password</label>
        <div class="login-input-wrap">
          <i class="ti ti-lock login-input-icon" aria-hidden="true"></i>
          <input class="login-input" id="login-password" type="password" placeholder="Your password" autocomplete="current-password"/>
          <button class="login-eye-btn" type="button" aria-label="Show password" onclick="var i=document.getElementById('login-password');i.type=i.type==='password'?'text':'password';this.querySelector('i').className='ti '+(i.type==='password'?'ti-eye':'ti-eye-off');">
            <i class="ti ti-eye" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div class="login-meta-row">
        <label class="login-check-label">
          <input type="checkbox"/> Remember me
        </label>
        <a href="#" class="login-forgot">Forgot password?</a>
      </div>

      <button class="btn-sign-in" onclick="sendPrompt('Signed in &mdash; show the Fleet Mechanic dashboard for James')">
        Sign in <i class="ti ti-arrow-right" aria-hidden="true" style="font-size:15px;"></i>
      </button>

      <div class="login-divider">
        <div class="login-divider-line"></div>
        <span class="login-divider-text">or</span>
        <div class="login-divider-line"></div>
      </div>

      <button class="btn-sso-login">
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.092 17.64 11.784 17.64 9.2z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google SSO
      </button>

      <div class="login-form-footer">
        Need access? <a href="#">Contact your administrator</a><br>
        <a href="#">Terms &amp; Privacy</a> &middot; <a href="#">Cookie Preferences</a>
      </div>
    </div>
  </div>
</div>`;
}
