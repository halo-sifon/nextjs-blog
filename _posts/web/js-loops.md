---
title: 'JavaScript中的各种循环详解'
date: '2024-03-20'
category: '前端开发'
---

<!-- # JavaScript中的各种循环详解 -->

## 1. 基础循环语句

### for 循环
最基础也是最常用的循环方式之一：

```javascript
// 基本语法
for (let i = 0; i < 5; i++) {
    console.log(i); // 输出 0,1,2,3,4
}

// 多变量循环
for (let i = 0, j = 5; i < 3; i++, j--) {
    console.log(i, j); // 输出 0,5  1,4  2,3
}
```

### while 循环
当不确定循环次数，但知道循环条件时使用：

```javascript
let count = 0;
while (count < 3) {
    console.log(count); // 输出 0,1,2
    count++;
}
```

### do...while 循环
至少执行一次的循环：

```javascript
let num = 0;
do {
    console.log(num); // 至少输出一次
    num++;
} while (num < 3);
```

## 2. 现代循环方法

### for...of 循环
用于遍历可迭代对象（数组、字符串、Set、Map等）：

```javascript
// 遍历数组
const fruits = ['苹果', '香蕉', '橙子'];
for (const fruit of fruits) {
    console.log(fruit);
}

// 遍历字符串
const str = 'Hello';
for (const char of str) {
    console.log(char);
}

// 遍历Set
const set = new Set([1, 2, 3]);
for (const num of set) {
    console.log(num);
}
```

### for...in 循环
用于遍历对象的可枚举属性：

```javascript
const person = {
    name: '张三',
    age: 25,
    job: '程序员'
};

for (const key in person) {
    console.log(\`\${key}: \${person[key]}\`);
}
```

### forEach 方法
数组的内置方法，更函数式的写法：

```javascript
const numbers = [1, 2, 3];
numbers.forEach((num, index) => {
    console.log(\`索引\${index}: \${num}\`);
});
```

## 3. 高级循环方法

### map 方法
转换数组中的每个元素：

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6]

// 处理对象数组
const users = [
    { name: '张三', age: 20 },
    { name: '李四', age: 25 }
];
const names = users.map(user => user.name);
console.log(names); // ['张三', '李四']
```

### filter 方法
筛选符合条件的元素：

```javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]

// 复杂条件筛选
const users = [
    { name: '张三', age: 20 },
    { name: '李四', age: 25 },
    { name: '王五', age: 30 }
];
const adults = users.filter(user => user.age >= 25);
```

### reduce 方法
将数组归约为单个值：

```javascript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// 数组转对象
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana'];
const count = fruits.reduce((acc, fruit) => {
    acc[fruit] = (acc[fruit] || 0) + 1;
    return acc;
}, {});
console.log(count); // { apple: 2, banana: 2, orange: 1 }
```

## 4. 性能优化技巧

### 缓存数组长度
```javascript
// 低效写法
for (let i = 0; i < array.length; i++) {}

// 优化写法
for (let i = 0, len = array.length; i < len; i++) {}
```

### 提前结束循环
```javascript
const array = [1, 2, 3, 4, 5];
for (let i = 0; i < array.length; i++) {
    if (array[i] === 3) {
        break; // 找到目标后立即结束循环
    }
}
```

### 避免在循环中创建函数
```javascript
// 不推荐
for (let i = 0; i < 1000; i++) {
    element.onclick = function() { // 每次循环都创建新函数
        console.log(i);
    };
}

// 推荐
function handleClick(i) {
    console.log(i);
}
for (let i = 0; i < 1000; i++) {
    element.onclick = handleClick.bind(null, i);
}
```

## 5. 异步循环处理

### 使用 async/await
```javascript
async function processItems(items) {
    for (const item of items) {
        await processItem(item); // 顺序处理
    }
}

// 并行处理
async function processItemsParallel(items) {
    const promises = items.map(item => processItem(item));
    await Promise.all(promises);
}
```

### 控制并发数
```javascript
async function processWithLimit(items, limit = 3) {
    const chunks = [];
    for (let i = 0; i < items.length; i += limit) {
        const chunk = items.slice(i, i + limit);
        const results = await Promise.all(
            chunk.map(item => processItem(item))
        );
        chunks.push(...results);
    }
    return chunks;
}
```

## 总结

1. **选择合适的循环方式**
   - 简单遍历：for...of
   - 对象属性：for...in
   - 数组处理：map/filter/reduce
   - 异步操作：async/await with for...of

2. **性能考虑**
   - 缓存循环条件
   - 适时break/continue
   - 避免循环中创建函数
   - 选择合适的遍历方法

3. **最佳实践**
   - 保持代码清晰可读
   - 适当的错误处理
   - 注意内存使用
   - 考虑性能优化

掌握这些循环方法和最佳实践，能够帮助我们写出更高效、更易维护的代码。选择合适的循环方式不仅能提高代码的性能，还能提升代码的可读性和可维护性。 