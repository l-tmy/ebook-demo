<template>
  <div class="ebook">
    <title-bar :ifTileAndMenuShow="ifTileAndMenuShow"></title-bar>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleTileAndMenu"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <menu-bar :ifTileAndMenuShow="ifTileAndMenuShow"
              :fontSizeList="fontSizeList"
              :defaultSize="defaultSize"
              @setFontSize="setFontSize"
              :themeList="themeList"
              :defaultTheme="defaultTheme"
              @setTheme="setTheme"
              :bookAvailable="bookAvailable"
              @onProgressChange="onProgressChange"
              @jumpTo="jumpTo"
              :navigation="navigation"
              ref="menuBar"></menu-bar>
  </div>
</template>

<script>
import Epub from 'epubjs'
import TitleBar from '@/components/TitleBar'
import MenuBar from '@/components/MenuBar'
const DOWNLOAD_URL = '/static/ebook.epub'
export default {
  name: 'Ebook',
  components: {
    TitleBar,
    MenuBar
  },
  data() {
    return {
      book: '',
      rendition: '',
      themes: '',
      ifTileAndMenuShow: false,
      fontSizeList: [
        {fontSize: 12},
        {fontSize: 14},
        {fontSize: 16},
        {fontSize: 18},
        {fontSize: 20},
        {fontSize: 22},
        {fontSize: 24}
      ],
      defaultSize: 16, // 默认字号
      themeList: [
        {
          name: 'default',
          style: {
            body: {
              'color': '#000',
              'background': '#fff'
            }
          }
        },
        {
          name: 'eye',
          style: {
            body: {
              'color': '#000',
              'background': '#ceeaba'
            }
          }
        },
        {
          name: 'night',
          style: {
            body: {
              'color': '#fff',
              'background': '#000'
            }
          }
        },
        {
          name: 'gold',
          style: {
            body: {
              'color': '#000',
              'background': 'rgba(241, 236, 226)'
            }
          }
        }
      ],
      defaultTheme: 0,
      bookAvailable: false, // 图书是否处于可用状态
      navigation: {}
    }
  },
  methods: {
    // 电子书的解析和渲染
    showEpub() {
      // 生成Book
      this.book = new Epub(DOWNLOAD_URL)
      // 生成Rendition
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      // 通过Rendition.display 渲染电子书
      this.rendition.display()
      // 获取theme对象
      this.themes = this.rendition.themes
      // 设置默认字体
      this.setFontSize(this.defaultSize)
      // 设置主题，this.themes.register(name, styles) // 设置
      // this.themes.select(name) 切换
      this.registerTheme()
      // this.themes.select('eye')
      this.setTheme(this.defaultTheme)
      // 设置进度条，获取location对象
      // 通过epubjs的钩子函数来实现
      this.book.ready.then(() => {
        this.navigation = this.book.navigation // 获取目录
        console.log(this.navigation)
        return this.book.locations.generate()
      }).then(() => {
        this.locations = this.book.locations
        this.bookAvailable = true
      })
    },
    prevPage() {
      // Rendition.prev
      if (this.rendition) {
        this.rendition.prev()
      }
    },
    nextPage() {
      // Rendition.next
      if (this.rendition) {
        this.rendition.next()
      }
    },
    toggleTileAndMenu() {
      this.ifTileAndMenuShow = !this.ifTileAndMenuShow
      if (!this.ifTileAndMenuShow) {
        this.$refs.menuBar.hideSetting() // 调用子组件方法
      }
    },
    hideTitleAndMenu() {
      // 隐藏标题栏和菜单栏
      this.ifTileAndMenuShow = false
      // 隐藏菜单栏弹出的设置栏
      this.$refs.menuBar.hideSetting()
      // 隐藏目录
      this.$refs.menuBar.hideContent()
    },
    // 设置字号
    setFontSize(fontSize) {
      this.defaultSize = fontSize
      if (this.themes) {
        this.themes.fontSize(fontSize + 'px') // 使用themes的fontSize()方法设置字号
      }
    },
    // 设置主题
    registerTheme() {
      // 注册主题
      this.themeList.forEach(theme => {
        this.themes.register(theme.name, theme.style)
      })
    },
    setTheme(index) {
      this.themes.select(this.themeList[index].name)
      this.defaultTheme = index
    },
    // 设置进度条(0-100)
    onProgressChange(progress) {
      const percentage = progress / 100
      const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
      this.rendition.display(location)
    },
    // 根据链接跳转到指定位置
    jumpTo(href) {
      this.rendition.display(href)
      this.hideTitleAndMenu()
    }
  },
  mounted() {
    this.showEpub()
  }
}
</script>

<style lang="scss" scoped >
  @import "assets/styles/global";
  .ebook{
    position: relative;
    .read-wrapper{
      .mask{
        position:absolute;
        top:0;
        left: 0;
        z-index: 100;
        display: flex;
        width:100%;
        height: 100%;
        .left{
          flex: 0 0 px2rem(100);  /* flex-grow,flex-shrink,flex-basis */
        }
        .center{
          flex:1;
        }
        .right{
          flex: 0 0 px2rem(100);
        }
      }
    }
  }
</style>
