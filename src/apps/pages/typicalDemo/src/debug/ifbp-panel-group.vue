<template>
  <div :class="[
    'ifbp-item-group',
    navbar? 'nav-bar':'',
    ]">
    <div class="ifbp-item-group-main">
      <slot></slot>
    </div>

    <ul class="ifbp-item-group-nav-bar" v-if="navbar" >
        <li v-for="(item, index) in navBarData" :class="{'selected': index === nowIndex}" :key="index">
          <a href="javascript:;" :panelId="item.id"  @click="e =>{navBarClick(e,index)}">{{item.title}}</a>
        </li>
        <span class="line" :style="ulSpanStyle"></span>
      </ul>
  </div>
</template>

<script>
import { addResizeListener } from "./resize-event";
export default {
  name: "IfbpPanelGroup",

  componentName: "IfbpPanelGroup",

  props: {
    navbar: Boolean,
    baseScrollTop: {
      type: [String, Number],
      default: 45
    },
    baseNavBarTop: {
      type: [String, Number],
      default: 120
    },
    scrollDom: {
      default: "ifbpScrollDom"
    }
  },

  data() {
    return {
      nowIndex: 0,
      realBaseNavBarTop: 120,
      navBarData: [],
      panelCompArr: [],
      resetNavBarDataTimeOut: ""
    };
  },
  created() {
    this.$on("childChange", this.childChangeFun);
  },
  mounted() {
    let $tabs = $(".el-tabs__item");
    this.realBaseNavBarTop = this.baseNavBarTop + ($tabs.length > 0 ? 31 : 0);
    // debugger;
    if (this.navbar) {
      this.$nextTick(function() {
        if (this.$el.querySelectorAll(".ifbp-item-group-nav-bar")[0]) {
          this.$el.querySelectorAll(".ifbp-item-group-nav-bar")[0].style.top =
            this.realBaseNavBarTop + "px";
        }
        this.getPanelHeight();
        addResizeListener(this.$el, this.getPanelHeight);
        this.realScrollDom.addEventListener("scroll", this.onScroll);
      });
    }
  },

  methods: {
    getPanelHeight() {
      this.navBarData.forEach(navdata => {
        navdata.panelHeight = navdata.vnodeElm.offsetHeight;
      });
    },
    navBarClick(e, index) {
      e.preventDefault();
      const target = e.currentTarget;
      if (target) {
        const panelId = target.getAttribute("panelId");
        const toDom = document.getElementById(panelId);
        this.nowIndex = index;

        if (toDom) {
          toDom.scrollIntoView(); // 根据id找到对应DOM滚动到顶部
        }
        this.$nextTick(function() {
          let scrollTop;
          if (this.realScrollDom === window) {
            scrollTop =
              document.documentElement.scrollTop || document.body.scrollTop;
          } else {
            scrollTop = this.realScrollDom.scrollTop;
          }

          var nowHeight = parseInt(this.baseScrollTop);

          if (scrollTop < parseInt(this.baseScrollTop) - 6) {
            this.$el.querySelectorAll(".ifbp-item-group-nav-bar")[0].style.top =
              parseInt(this.realBaseNavBarTop) - scrollTop + "px";
          } else {
            this.$el.querySelectorAll(".ifbp-item-group-nav-bar")[0].style.top =
              parseInt(this.realBaseNavBarTop) -
              (parseInt(this.baseScrollTop) - 6) +
              "px";
          }
        });
      }
    },
    onScroll() {
      let scrollTop;
      if (this.realScrollDom === window) {
        scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
      } else {
        scrollTop = this.realScrollDom.scrollTop;
      }

      var nowHeight = parseInt(this.baseScrollTop);

      if (scrollTop < parseInt(this.baseScrollTop) - 6) {
        this.$el.querySelectorAll(".ifbp-item-group-nav-bar")[0].style.top =
          parseInt(this.realBaseNavBarTop) - scrollTop + "px";
      } else {
        this.$el.querySelectorAll(".ifbp-item-group-nav-bar")[0].style.top =
          parseInt(this.realBaseNavBarTop) -
          (parseInt(this.baseScrollTop) - 6) +
          "px";
      }

      if (scrollTop < nowHeight) {
        this.nowIndex = 0;
        return;
      }
      for (var i = 0; i < this.navBarData.length; i++) {
        nowHeight += this.navBarData[i].panelHeight;
        if (scrollTop < nowHeight) {
          this.nowIndex = i;
          return;
        }
      }
      this.nowIndex = this.navBarData.length - 1;
    },
    childChangeFun() {
      this.resetNavBarData();
    },
    resetNavBarData() {
      if (this.resetNavBarDataTimeOut) {
        clearTimeout(this.resetNavBarDataTimeOut);
      }
      let vm = this;
      this.resetNavBarDataTimeOut = setTimeout(function() {
        vm.resetNavBarDataFun();
      }, 200);
    },
    resetNavBarDataFun() {
      var navBarDataArr = [];
      var $ifbpPanels = $(this.$el).find(".ifbp-panel");
      $ifbpPanels.each((index, panelDom) => {
        let vuePanel = panelDom.__vue__;
        let vnode = vuePanel.$vnode;
        if (
          vnode.componentOptions &&
          vnode.componentOptions.tag === "ifbp-panel"
        ) {
          var propsData =
            vnode.componentOptions && vnode.componentOptions.propsData;
          var title = propsData.title;
          var id = propsData.id;
          title = title ? title : "";
          navBarDataArr.push({
            id: id,
            title: title,
            vnodeElm: vnode.elm
          });
        }
      });
      this.navBarData = navBarDataArr;
      this.getPanelHeight();
    }
  },

  computed: {
    ulSpanStyle() {
      var height = (this.navBarData.length - 1) * 35;
      return "height:" + height + "px";
    },
    realScrollDom() {
      if (this.scrollDom === "ifbpScrollDom") {
        return (
          document.getElementsByClassName("list-complete-item")[0] ||
          document.getElementsByClassName("main-panel")[0]
        );
      } else {
        return this.scrollDom;
      }
    }
  }
};
</script>

<style>

</style>
