import Component from '../component'

export default {
	/**
	 * 默认参数
	 */
  setDefaults() {
    return {
      type: `text`,
      timer: 1500,
      color: `#fff`,
      text: `已完成`,
      success() { },
    }
  },
	/**
	 * 默认数据
	 */
  data() {
    return [
      {
        type: `text`,
        icon: ``,
        className: `yjp-toast--text`,
      },
      {
        type: `img`,
        imgUrl: ``,
        className: `yjp-toast--text`,
      },
    ]
  },
	/**
	 * 显示toast组件
	 * @param {Object} opts 配置项
	 * @param {String} opts.type 提示类型
	 * @param {Number} opts.timer 提示延迟时间
	 * @param {String} opts.color 图标颜色
	 * @param {String} opts.text 提示文本
	 * @param {Function} opts.success 关闭后的回调函数
	 */
  show(opts = {}) {
    const options = Object.assign({}, this.setDefaults(), opts)
    if (typeof options.text !== `string`) options.text = ``
    const TOAST_TYPES = this.data()

    // 判断提示类型，显示对应的图标
    TOAST_TYPES.forEach((value, key) => {
      if (value.type === opts.type) {
        options.className = value.className
      }
    })

    // 实例化组件
    const component = new Component({
      scope: `$yjp.toast`,
      data: options,
      methods: {
				/**
				 * 隐藏
				 */
        hide(cb) {
          setTimeout(() => {
            this.setHidden()
            typeof cb === `function` && cb()
          }, options.timer)
        },
				/**
				 * 显示
				 */
        show() {
          this.setVisible()
        },
      },
    })

    component.show()
    component.hide(opts.success)
  },
}