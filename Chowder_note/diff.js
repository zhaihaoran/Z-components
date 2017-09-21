/**
 * 仅供学习参考，加深了解React Virtual Dom 思想
 * @author KaBulu Driver <zhaihaoran@iqidao.com>
 * @description 
 * 参考地址：
 * https://github.com/livoras/simple-virtual-dom
 * https://github.com/livoras/blog/issues/13
 */

/**
 * Virtual Dom 算法
 */

// 1. 模拟Dom树
class Element {

    /**
     * Creates an instance of Element.
     * @param {string} tagName 节点名称 @example div,p,li
     * @param {any} props 节点属性  @example .box #box
     * @param {any} children 子节点
     * @memberof Element
     */
    constructor(tagName, props, children) {
        this.tagName = tagName
        this.props = props
        this.children = children
    }

    /**
     * 渲染Dom
     * 
     * @memberof Element
     */
    render() {
        let el = document.createElement(this.tagName)
        let props = this.props

        for (let propName in props) { // 设置节点的DOM属性
            let propValue = props[propName]
            el.setAttribute(propName, propValue)
        }
    }

}

module.exports = {Element}