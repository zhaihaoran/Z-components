(function () {
    if (true) {
        var x = 'hello';
    }

    for (var i = 0; i < 10; i++) {
        console.log(i);
    }
    // 说明i和x都是全局变量
    console.log(x, i)
})()

// 表现形式：瞬间5个5
// for循环里i++ 和++i 表现形式是一样的

// for循环是执行完里面的内容之后，才执行i++和++i的，所以没有任何不同
for (var i = 0; i < 5; ++i) {
    setTimeout(function () {
        console.log(i);
    }, 1000)
}

// 表现形式：瞬间0,1,2,3,4
for (let i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log(i);
    }, 1000)
}

// 如果想实现每秒变化1，2，3，4，5，如何实现
for (var i = 0; i < 5; ++i) {
    (function (m) {
        setTimeout(function () {
            console.log(m);
        }, 1000 * m);
    })(i)
}