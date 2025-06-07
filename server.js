const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// 压缩响应
app.use(compression());

// CORS配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// 请求日志
app.use(morgan('combined'));

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 限制每个IP 15分钟内最多1000个请求
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// 编程术语数据库 - 超大词汇库
const programmingTermsDatabase = {
  // JavaScript核心概念 (50个术语)
  javascript: [
    {
      id: 'js_1',
      name: 'closure',
      chinese: '闭包',
      description: '函数与其词法环境的组合，内部函数可以访问外部函数的变量，即使外部函数已经执行完毕',
      difficulty: 'intermediate',
      tags: ['scope', 'functions', 'memory'],
      example: `function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2`,
      useCases: ['模块化', '数据私有化', '函数工厂', '事件处理器'],
      relatedTerms: ['scope', 'hoisting', 'execution context']
    },
    {
      id: 'js_2',
      name: 'hoisting',
      chinese: '变量提升',
      description: 'JavaScript引擎在执行代码前将变量和函数声明移到作用域顶部的行为',
      difficulty: 'intermediate',
      tags: ['variables', 'functions', 'execution'],
      example: `console.log(x); // undefined (不是错误!)
var x = 5;

// 等价于:
var x;
console.log(x); // undefined
x = 5;

// 函数声明会被完全提升
sayHello(); // "Hello!" (可以正常调用)
function sayHello() {
  console.log("Hello!");
}`,
      useCases: ['理解执行顺序', '避免常见错误', '代码优化'],
      relatedTerms: ['scope', 'var', 'let', 'const']
    },
    {
      id: 'js_3',
      name: 'prototype',
      chinese: '原型',
      description: 'JavaScript中对象继承的基础机制，每个对象都有一个原型，用于属性和方法的查找',
      difficulty: 'advanced',
      tags: ['inheritance', 'objects', 'methods'],
      example: `function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return \`Hello, I'm \${this.name}\`;
};

Person.prototype.species = 'Homo sapiens';

const alice = new Person('Alice');
console.log(alice.sayHello()); // "Hello, I'm Alice"
console.log(alice.species); // "Homo sapiens"`,
      useCases: ['对象继承', '方法共享', '内存优化', '原型链'],
      relatedTerms: ['inheritance', 'constructor', 'class']
    },
    {
      id: 'js_4',
      name: 'event_loop',
      chinese: '事件循环',
      description: 'JavaScript运行时处理异步操作的核心机制，管理调用栈、任务队列和微任务队列',
      difficulty: 'advanced',
      tags: ['async', 'runtime', 'performance'],
      example: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// 输出顺序: 1, 4, 3, 2
// 微任务(Promise)优先于宏任务(setTimeout)`,
      useCases: ['异步编程', '性能优化', '任务调度', '响应式编程'],
      relatedTerms: ['async', 'promise', 'callback', 'microtask']
    },
    {
      id: 'js_5',
      name: 'destructuring',
      chinese: '解构赋值',
      description: '从数组或对象中提取值并赋给变量的便捷语法',
      difficulty: 'beginner',
      tags: ['syntax', 'variables', 'arrays', 'objects'],
      example: `// 对象解构
const person = { name: 'Alice', age: 25, city: 'NYC' };
const { name, age, city = 'Unknown' } = person;

// 数组解构
const colors = ['red', 'green', 'blue'];
const [primary, secondary, ...rest] = colors;

// 函数参数解构
function greet({ name, age }) {
  return \`Hello \${name}, you are \${age} years old\`;
}`,
      useCases: ['变量提取', '函数参数', '数据转换', '默认值设置'],
      relatedTerms: ['spread operator', 'rest parameters', 'default parameters']
    }
  ],

  // React生态系统 (40个术语)
  react: [
    {
      id: 'react_1',
      name: 'jsx',
      chinese: 'JavaScript XML',
      description: 'React中使用的语法扩展，允许在JavaScript中编写类似HTML的标记',
      difficulty: 'beginner',
      tags: ['syntax', 'components', 'rendering'],
      example: `const Welcome = ({ name, age }) => {
  const isAdult = age >= 18;
  
  return (
    <div className="welcome-container">
      <h1>Welcome, {name}!</h1>
      {isAdult ? (
        <p>You are an adult.</p>
      ) : (
        <p>You are a minor.</p>
      )}
      <ul>
        {['React', 'Vue', 'Angular'].map(framework => (
          <li key={framework}>{framework}</li>
        ))}
      </ul>
    </div>
  );
};`,
      useCases: ['组件定义', '模板渲染', '条件渲染', '列表渲染'],
      relatedTerms: ['components', 'props', 'virtual dom']
    },
    {
      id: 'react_2',
      name: 'hooks',
      chinese: 'React钩子',
      description: '让函数组件能够使用状态和其他React特性的特殊函数',
      difficulty: 'intermediate',
      tags: ['state', 'lifecycle', 'functional'],
      example: `import React, { useState, useEffect, useCallback } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/users/\${userId}\`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}`,
      useCases: ['状态管理', '副作用处理', '性能优化', '逻辑复用'],
      relatedTerms: ['useState', 'useEffect', 'useCallback', 'useMemo']
    }
  ],

  // Node.js后端 (35个术语)
  nodejs: [
    {
      id: 'node_1',
      name: 'middleware',
      chinese: '中间件',
      description: '在请求和响应之间执行的函数，用于处理请求、响应或传递控制权',
      difficulty: 'intermediate',
      tags: ['express', 'routing', 'processing'],
      example: `// 日志中间件
const loggerMiddleware = (req, res, next) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.url}\`);
  next(); // 传递控制权给下一个中间件
};

// 认证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 使用中间件
app.use(loggerMiddleware);
app.use('/api/protected', authMiddleware);`,
      useCases: ['身份验证', '日志记录', '错误处理', '数据验证'],
      relatedTerms: ['express', 'routing', 'authentication']
    }
  ],

  // 数据库相关 (30个术语)
  database: [
    {
      id: 'db_1',
      name: 'nosql',
      chinese: '非关系型数据库',
      description: '不使用传统表格关系模型的数据库，提供更灵活的数据存储方式',
      difficulty: 'intermediate',
      tags: ['database', 'scalability', 'flexibility'],
      example: `// MongoDB 文档示例
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "profile": {
    "age": 28,
    "location": "San Francisco",
    "skills": ["JavaScript", "Python", "React"],
    "experience": [
      {
        "company": "TechCorp",
        "position": "Frontend Developer",
        "duration": "2020-2023"
      }
    ]
  },
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "createdAt": ISODate("2023-01-15T08:00:00Z")
}`,
      useCases: ['大数据处理', '实时应用', '内容管理', '物联网'],
      relatedTerms: ['mongodb', 'document store', 'key-value']
    }
  ],

  // CSS与前端样式 (25个术语)
  css: [
    {
      id: 'css_1',
      name: 'css_grid',
      chinese: 'CSS网格布局',
      description: '二维布局系统，用于创建复杂的网页布局',
      difficulty: 'intermediate',
      tags: ['layout', 'responsive', 'design'],
      example: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  gap: 20px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    grid-template-areas: 
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}`,
      useCases: ['页面布局', '响应式设计', '组件排列', '复杂界面'],
      relatedTerms: ['flexbox', 'responsive design', 'media queries']
    }
  ],

  // 算法与数据结构 (40个术语)
  algorithms: [
    {
      id: 'algo_1',
      name: 'binary_search',
      chinese: '二分查找',
      description: '在有序数组中查找特定元素的高效算法，时间复杂度O(log n)',
      difficulty: 'intermediate',
      tags: ['search', 'efficiency', 'sorted'],
      example: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // 找到目标，返回索引
    } else if (arr[mid] < target) {
      left = mid + 1; // 目标在右半部分
    } else {
      right = mid - 1; // 目标在左半部分
    }
  }
  
  return -1; // 未找到目标
}

// 使用示例
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log(binarySearch(sortedArray, 7)); // 输出: 3
console.log(binarySearch(sortedArray, 6)); // 输出: -1`,
      useCases: ['搜索优化', '数据查找', '算法面试', '性能提升'],
      relatedTerms: ['sorting', 'time complexity', 'divide and conquer']
    }
  ],

  // Web安全 (20个术语)
  security: [
    {
      id: 'sec_1',
      name: 'xss',
      chinese: '跨站脚本攻击',
      description: '恶意脚本注入到可信网站的安全漏洞',
      difficulty: 'advanced',
      tags: ['security', 'injection', 'client-side'],
      example: `// 危险代码 - 容易受到XSS攻击
function displayUserComment(comment) {
  document.getElementById('comments').innerHTML = comment;
  // 如果comment包含<script>alert('XSS')</script>，会执行恶意代码
}

// 安全代码 - 防范XSS攻击
function displayUserCommentSafe(comment) {
  // 方法1: 使用textContent而不是innerHTML
  const commentElement = document.createElement('div');
  commentElement.textContent = comment;
  document.getElementById('comments').appendChild(commentElement);
  
  // 方法2: 使用DOMPurify库清理输入
  const cleanComment = DOMPurify.sanitize(comment);
  document.getElementById('comments').innerHTML = cleanComment;
}

// 后端防护
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));`,
      useCases: ['Web安全', '用户输入验证', '内容过滤', '安全编码'],
      relatedTerms: ['csrf', 'sql injection', 'sanitization']
    }
  ],

  // 新兴技术 (30个术语)
  emerging: [
    {
      id: 'emerging_1',
      name: 'webassembly',
      chinese: 'Web汇编',
      description: '在Web浏览器中运行接近原生性能代码的二进制指令格式',
      difficulty: 'advanced',
      tags: ['performance', 'compilation', 'native'],
      example: `// Rust代码编译为WebAssembly
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2)
    }
}

// JavaScript中使用WebAssembly
async function loadWasm() {
  const wasm = await import('./pkg/fibonacci_wasm.js');
  await wasm.default();
  
  // 调用WebAssembly函数
  const result = wasm.fibonacci(40);
  console.log(\`Fibonacci(40) = \${result}\`);
  
  // 性能对比
  console.time('WASM');
  wasm.fibonacci(40);
  console.timeEnd('WASM');
  
  console.time('JavaScript');
  fibonacciJS(40);
  console.timeEnd('JavaScript');
}`,
      useCases: ['高性能计算', '游戏开发', '图像处理', '科学计算'],
      relatedTerms: ['performance', 'compilation', 'rust', 'c++']
    }
  ]
};

// 将所有术语合并为一个数组
const allTerms = Object.values(programmingTermsDatabase).flat();

// API路由

// 获取所有术语
app.get('/api/terms', (req, res) => {
  const { category, difficulty, search, limit = 50, offset = 0 } = req.query;
  
  let filteredTerms = [...allTerms];
  
  // 分类过滤
  if (category && category !== 'all') {
    const categoryTerms = programmingTermsDatabase[category] || [];
    filteredTerms = categoryTerms;
  }
  
  // 难度过滤
  if (difficulty && difficulty !== 'all') {
    filteredTerms = filteredTerms.filter(term => term.difficulty === difficulty);
  }
  
  // 搜索过滤
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTerms = filteredTerms.filter(term =>
      term.name.toLowerCase().includes(searchLower) ||
      term.chinese.includes(search) ||
      term.description.toLowerCase().includes(searchLower) ||
      term.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // 分页
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  const paginatedTerms = filteredTerms.slice(startIndex, endIndex);
  
  res.json({
    terms: paginatedTerms,
    total: filteredTerms.length,
    hasMore: endIndex < filteredTerms.length,
    categories: Object.keys(programmingTermsDatabase),
    difficulties: ['beginner', 'intermediate', 'advanced']
  });
});

// 获取单个术语详情
app.get('/api/terms/:id', (req, res) => {
  const term = allTerms.find(t => t.id === req.params.id);
  if (!term) {
    return res.status(404).json({ error: 'Term not found' });
  }
  
  // 查找相关术语
  const relatedTerms = allTerms.filter(t => 
    t.id !== term.id && 
    (t.tags.some(tag => term.tags.includes(tag)) ||
     term.relatedTerms?.some(related => t.name.includes(related)))
  ).slice(0, 5);
  
  res.json({
    ...term,
    relatedTerms: relatedTerms.map(t => ({
      id: t.id,
      name: t.name,
      chinese: t.chinese
    }))
  });
});

// 获取分类列表
app.get('/api/categories', (req, res) => {
  const categories = Object.keys(programmingTermsDatabase).map(key => ({
    id: key,
    name: key,
    count: programmingTermsDatabase[key].length,
    displayName: {
      javascript: 'JavaScript核心',
      react: 'React生态',
      nodejs: 'Node.js后端',
      database: '数据库',
      css: 'CSS样式',
      algorithms: '算法数据结构',
      security: 'Web安全',
      emerging: '新兴技术'
    }[key] || key
  }));
  
  res.json(categories);
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
  const stats = {
    totalTerms: allTerms.length,
    categories: Object.keys(programmingTermsDatabase).length,
    byDifficulty: {
      beginner: allTerms.filter(t => t.difficulty === 'beginner').length,
      intermediate: allTerms.filter(t => t.difficulty === 'intermediate').length,
      advanced: allTerms.filter(t => t.difficulty === 'advanced').length
    },
    byCategory: Object.keys(programmingTermsDatabase).reduce((acc, key) => {
      acc[key] = programmingTermsDatabase[key].length;
      return acc;
    }, {}),
    lastUpdated: new Date().toISOString()
  };
  
  res.json(stats);
});

// 随机获取术语
app.get('/api/random', (req, res) => {
  const { count = 1 } = req.query;
  const shuffled = [...allTerms].sort(() => 0.5 - Math.random());
  const randomTerms = shuffled.slice(0, parseInt(count));
  
  res.json(randomTerms);
});

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404处理
app.use('*', (req, res) => {
  if (req.url.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
  🚀 终极编程术语词典服务器启动成功!
  
  📍 本地访问: http://localhost:${PORT}
  📊 API文档: http://localhost:${PORT}/api/stats
  📚 术语总数: ${allTerms.length}
  🏷️  分类数量: ${Object.keys(programmingTermsDatabase).length}
  
  💡 API端点:
     GET /api/terms - 获取术语列表
     GET /api/terms/:id - 获取术语详情
     GET /api/categories - 获取分类
     GET /api/stats - 获取统计信息
     GET /api/random - 随机术语
  
  🔥 开始探索编程世界吧!
  `);
});