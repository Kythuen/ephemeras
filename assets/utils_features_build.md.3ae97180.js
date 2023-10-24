import{_ as s,o as a,c as n,Q as p}from"./chunks/framework.07ff08c4.js";const h=JSON.parse('{"title":"build","description":"","frontmatter":{},"headers":[],"relativePath":"utils/features/build.md","filePath":"utils/features/build.md"}'),l={name:"utils/features/build.md"},e=p(`<h1 id="build" tabindex="-1">build <a class="header-anchor" href="#build" aria-label="Permalink to &quot;build&quot;">​</a></h1><p>这里提供 Node 项目开发过程中一些常用的方法, 主要是项目环境判断和读取项目信息的一些方法。</p><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to &quot;使用方法&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  isProject,</span></span>
<span class="line"><span style="color:#E1E4E8;">  readPKG,</span></span>
<span class="line"><span style="color:#E1E4E8;">  getPackageManager,</span></span>
<span class="line"><span style="color:#E1E4E8;">  getPackageManagers,</span></span>
<span class="line"><span style="color:#E1E4E8;">  isPnpmWorkspaceRepo</span></span>
<span class="line"><span style="color:#E1E4E8;">} </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@ephemeras/utils&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 判断项目是否为 npm 项目</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">isNpmProject</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isProject</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 读取 package.json 文件的信息</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">PKG</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">readPKG</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 获取当前项目已有的包管理器</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">currentPM</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getPackageManager</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 获取已安装的包管理器列表</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">PMList</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getPackageManagers</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 判断项目是否为 pnpm workspace 项目</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">isMonorepo</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">isPnpmWorkspaceRepo</span><span style="color:#E1E4E8;">()</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  isProject,</span></span>
<span class="line"><span style="color:#24292E;">  readPKG,</span></span>
<span class="line"><span style="color:#24292E;">  getPackageManager,</span></span>
<span class="line"><span style="color:#24292E;">  getPackageManagers,</span></span>
<span class="line"><span style="color:#24292E;">  isPnpmWorkspaceRepo</span></span>
<span class="line"><span style="color:#24292E;">} </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@ephemeras/utils&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 判断项目是否为 npm 项目</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">isNpmProject</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isProject</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 读取 package.json 文件的信息</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">PKG</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">readPKG</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 获取当前项目已有的包管理器</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">currentPM</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getPackageManager</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 获取已安装的包管理器列表</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">PMList</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getPackageManagers</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 判断项目是否为 pnpm workspace 项目</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">isMonorepo</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">isPnpmWorkspaceRepo</span><span style="color:#24292E;">()</span></span></code></pre></div><h2 id="isproject" tabindex="-1">isProject <a class="header-anchor" href="#isproject" aria-label="Permalink to &quot;isProject&quot;">​</a></h2><p>判断当前目录是否是一个 npm 项目</p><p><code>(): boolean</code></p><h2 id="readpkg" tabindex="-1">readPKG <a class="header-anchor" href="#readpkg" aria-label="Permalink to &quot;readPKG&quot;">​</a></h2><p>读取 package.json 文件的信息，而无需在 tsconfig.json 中包含它</p><p><code>(): object</code></p><h2 id="getpackagemanager" tabindex="-1">getPackageManager <a class="header-anchor" href="#getpackagemanager" aria-label="Permalink to &quot;getPackageManager&quot;">​</a></h2><p>获取当前项目已有的包管理器，默认为 <code>npm</code></p><p><code>(): string</code></p><h2 id="getpackagemanagers" tabindex="-1">getPackageManagers <a class="header-anchor" href="#getpackagemanagers" aria-label="Permalink to &quot;getPackageManagers&quot;">​</a></h2><p>获取当前项目已有的包管理器，如<code>npm</code>, <code>yarn</code>, <code>pnpm</code></p><p><code>(): string[]</code></p><h2 id="ispnpmworkspacerepo" tabindex="-1">isPnpmWorkspaceRepo <a class="header-anchor" href="#ispnpmworkspacerepo" aria-label="Permalink to &quot;isPnpmWorkspaceRepo&quot;">​</a></h2><p>判断项目是否为 pnpm workspace 项目</p><p><code>(): boolean</code></p>`,19),o=[e];function c(t,r,i,y,E,d){return a(),n("div",null,o)}const P=s(l,[["render",c]]);export{h as __pageData,P as default};
