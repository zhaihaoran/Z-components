/**
 * 1.Two Sum 2017-9-20
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    var obj = {}
    var current;
    for (var i = 0; i < nums.length; i++) {
        current = nums[i];

        if (obj[target - current] !== undefined) {
            return [obj[target - current], i]
        }
        obj[current] = i;
    }
};

console.log(twoSum([2, 7, 11, 15], 9))


/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
// var addTwoNumbers = function (l1, l2) {
    // var a1 = l1.trim().replace(/\(|\)/g, "").split(" -> ").map(function(el){
    //     return +el;
    // });
    // var a2 = l2.trim().replace(/\(|\)/g, "").split(" -> ").map(function(el){
    //     return +el;
    // });;

//     var firstA = l1[l1.length - 1] + l1[l1.length - 2];
//     var firstB = l2[l2.length - 1] + l2[l2.length - 2];
//     var tenA, tenB, vA, vB;

//     if (firstA > 9) {
//         tenA = 1;
//         vA = firstA % 10;
//     } else {
//         tenA = 0;
//         vA = firstA
//     }
//     if (firstB > 9) {
//         tenB = 1;
//         vB = firstB % 10;
//     } else {
//         vB = firstB
//         tenB = 0;
//     }
//     return [vA,vB,(tenA + tenB + l1[0] + l2[0])]
// };

// console.log(addTwoNumbers([2,4,3], [5,6,4]))

var myAtoi = function(str) {
    str = str.trim().replace(/![\-\+\d]+/,"");
    if (str.length > 0 && /\d/.test(str) && !/\s/.test(str) && !/[\+\-]{2}/.test(str)) {
        if( parseInt(str) < 0 ) {
            return Math.max(parseInt(str,10),-2147483648);
        } else {
            return Math.min(parseInt(str,10),2147483647);
        }
    } else {
        return 0;
    }
};

console.log(myAtoi("   010"))