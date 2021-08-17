let arr = [
    { a: 1, b: 0, c: '2021-07-01' },
    { a: 1, b: 1, c: '2021-07-03' },
    { a: 1, b: 0, c: '2021-07-02' },
];
arr.sort((a, b) => {
    return a.c === b.c ? 0 : a.c < b.c ? 1 : -1;
});

let func = (a, b) => {
    console.log(a);
    console.log(b);
    if (a) {
        return 10;
    }
    return b;
};
let a = null;
let b = 1;
let c = func(a, b);

console.log(c);

let a = {
    success: true,
    data: [
        { task: 'tasks_1' },
        { task: 'tasks_2' },
        { task: 'tasks_3' },
        { task: 'tasks_4' },
    ],
    user: {
        user: `thông tin user`,
    },
    project_count: `số lượng project`,
};
