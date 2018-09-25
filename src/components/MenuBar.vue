<template>
    <div class="menu-bar">
      <transition name="slide-up">
        <div class="menu-wrapper"
             v-show="ifTileAndMenuShow"
             :class="{'hide-box-shadow'
             : isSettingShow || !ifTileAndMenuShow}">
          <div class="icon-wrapper">
            <span class="icon-menu icon"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-point-up icon" @click="showSetting(2)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-brightness-contrast icon" @click="showSetting(1)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-a icon" @click="showSetting(0)">A</span>
          </div>
        </div>
      </transition>
      <transition name="slide-up">
        <div class="setting-wrapper" v-show="isSettingShow">
          <!--设置字号-->
          <div class="setting-font-size" v-if="showTag === 0">
            <div class="preview" :style="{fontSize:fontSizeList[0].fontSize + 'px'}">A</div>
            <div class="select">
              <div class="select-wrapper"
                   v-for="(item,index) in fontSizeList"
                   :key="index"
                   @click="setFontSize(item.fontSize)">
                <div class="line"></div>
                <div class="point-wrapper">
                  <div class="point" v-show="defaultSize === item.fontSize">
                    <div class="small-point"></div>
                  </div>
                </div>
                <div class="line"></div>
              </div>
            </div>
            <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
          </div>
          <!--主题切换-->
          <div class="setting-theme" v-else-if="showTag === 1">
            <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
              <div class="preview" :style="{background: item.style.body.background}" :class="{'no-border': item.style.body.background !== '#fff'}"></div>
              <div class="text" :class="{'selected': index===defaultTheme}">{{item.name}}</div>
            </div>
          </div>
          <!--设置进度条-->
          <div class="setting-progress" v-else-if="showTag === 2">
            <div class="progress-wrapper">
              <input class="progress" type="range"
                     max="100"
                     min="0"
                     step="1"
                     @change="onProgressChange($event.target.value)"
                     @input="onProgressInput($event.target.value)"
                     :value="progress"
                     :disabled="!bookAvailable"
                     ref="progress">
            </div>
            <div class="text-wrapper">
              <span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div class="content-mask"
          v-show="ifShowContent"
          @click="hideContent"></div>
      </transition>
    </div>
</template>

<script>
export default {
  name: 'MenuBar',
  // props: ['ifTileAndMenuShow']
  props: {
    ifTileAndMenuShow: {
      type: Boolean,
      default: false
    },
    fontSizeList: Array,
    defaultSize: Number,
    themeList: Array,
    defaultTheme: Number,
    bookAvailable: Boolean,
    navigation: Object
  },
  data() {
    return {
      isSettingShow: true,
      showTag: 0,
      progress: 0,
      ifShowContent: true // 目录
    }
  },
  methods: {
    showSetting(showTag) {
      this.isSettingShow = true
      this.showTag = showTag
    },
    hideSetting() {
      this.isSettingShow = false
    },
    hideContent() {
      this.ifShowContent = false
    },
    setFontSize(fontSize) {
      this.$emit('setFontSize', fontSize)
    },
    setTheme(index) {
      this.$emit('setTheme', index)
    },
    // 进度条松开后触发事件，根据进度条数值跳转到指定位置
    onProgressChange(progress) {
      this.$emit('onProgressChange', progress)
    },
    // 拖动进度条时触发事件
    onProgressInput(progress) {
      this.progress = progress
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }
  }
}
</script>

<style lang="scss" scoped >
  @import "../assets/styles/global";
  .menu-bar{
    .menu-wrapper{
      position: absolute;
      display: flex;
      left:0;
      bottom:0;
      z-index: 102;
      width:100%;
      height: px2rem(48);
      background-color: #fff;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0,0,0,.15);
      &.hide-box-shadow{
        box-shadow:none;
      }
      .icon-wrapper{
        flex-grow:1;
        //@include center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .setting-wrapper{
      position:absolute;
      bottom: px2rem(48);
      left:0;
      z-index: 200;
      width:100%;
      height:px2rem(60);
      background-color: #fff;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0,0,0,.15);
      .setting-font-size{
        display: flex;
        height:100%;
        .preview{
          flex: 0 0 px2rem(40);
          @include center;
        }
        .select{
          flex-grow:1;
          display: flex;
          .select-wrapper{
            flex-grow:1;
            display: flex;
            align-items:center;
            &:first-child{
              .line{
                &:first-child{
                  border-top:none;
                }
              }
            }
            &:last-child{
              .line{
                &:last-child{
                  border-top:none;
                }
              }
            }
            .line{
              flex:1;
              height:0;
              border-top:px2rem(1) solid #ccc;
            }
            .point-wrapper{
              position:relative;
              flex:0 0 0;
              width:0;
              height:px2rem(7);
              border-left:px2rem(1) solid #ccc;
              .point{
                position: absolute;
                @include center;
                top:px2rem(-7);
                left:px2rem(-10);
                width: px2rem(20);
                height:px2rem(20);
                border-radius:50%;
                background-color: white;
                border:solid px2rem(1) #ccc;
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0,0,0,.15);
                .small-point{
                  width:px2rem(5);
                  height:px2rem(5);
                  background-color: #000;
                  border-radius:50%;
                }
              }
            }
          }
        }
      }
      .setting-theme{
        height:100%;
        display: flex;
        .setting-theme-item{
          flex:1;
          display: flex;
          flex-direction: column;
          padding:px2rem(5);
          box-sizing: border-box;
          .preview{
            flex:1;
            border:solid #ccc px2rem(1);
            box-sizing: border-box;
            &.no-border{
              border:none;
            }
          }
          .text{
            flex:0 0 px2rem(20);
            font-size: px2rem(14);
            color:#ccc;
            @include center;
            &.selected{
              color:#333;
            }
          }
        }
      }
      .setting-progress{
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        .progress-wrapper{
          width:100%;
          flex:1;
          @include center;
          .progress{
            width:100%;
            -webkit-appearance: none;
            height:px2rem(2);
            background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
            background-size:0 100%;
            &:focus{
              outline:none;
            }
            &::-webkit-slider-thumb{
              -webkit-appearance: none;
              height:px2rem(20);
              width:px2rem(20);
              border-radius: 50%;
              background: white;
              box-shadow: 0 4px 4px 0 rgba(0,0,0,.15);
              border: px2rem(1) solid #ddd;
            }
          }
        }
        .text-wrapper{
          flex:0 0 px2rem(20);
          width:100%;
          @include center;
          span{
            font-size:px2rem(14)
          }
        }
      }
    }
    .content-mask{
      position: absolute;
      top:0;
      left:0;
      z-index: 101;
      display: flex;
      width:100%;
      height:100%;
      background:rgba(51,51,51,.8);
    }
  }
</style>
