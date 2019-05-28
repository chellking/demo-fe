"use strict";
define(function (exports, module, require) {
    var lang = 'zh_CN';
    var e, t, n, i, o;
    "en_us" == lang || "en_US" == lang ? (e = "Please wait...", t = "confirm", n = "determine", i = "cancel", o = "delete") : "zh_tw" == lang || "zh_TW" == lang ? (e = "請稍等...", t = "確認", n = "確定", i = "取消", o = "删除") : (e = "请稍候...", t = "确认", n = "确定", i = "取消", o = "删除");
    var a = {
        isStringValid: function (e) {
            return "string" == typeof e && 0 !== e.trim().length
        },
        getUrlParams: function (e) {
            var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
                n = location.href,
                i = n.indexOf("?");
            n = n.substr(i + 1);
            var o = n.match(t);
            return null != o ? decodeURI(o[2]) : null
        },
        arryRemoveValue: function (e, t) {
            for (var n = 0; n < e.length; n++)
                if (e[n] == t) {
                    e.splice(n, 1);
                    break
                }
        },
        addRemoveClass: function (e, t, n) {
            var i = $("#" + t);
            $(i).on("click", n, function (t) {
                $(i).find(n).removeClass(e), $(this).addClass(e)
            })
        },
        getRef: function (e, t, n, i) {
            void 0 !== i && (i = JSON.stringify(i)), $.ajax({
                type: "get",
                url: "/uitemplate_web/iref_ctr/refInfo/",
                data: {
                    refCode: t
                },
                dataType: "json",
                async: !1,
                success: function (t) {
                    t = JSON.stringify(t), e.createField(n, {
                        refmodel: t,
                        refparam: i,
                        translations: "parent"
                    })
                }
            })
        },
        setParam: function (e, t, n) {
            var i = $('div[data-ref="' + e + '"]').attr("data-refparam");
            i = JSON.parse(i), i[t] = n, i = JSON.stringify(i), $('div[data-ref="' + e + '"]').attr("data-refparam", i)
        },
        getChildRef: function (e, t, n, i, o, a, d, r, c) {
            void 0 !== c && (c = JSON.stringify(c)), $.ajax({
                type: "get",
                url: "/uitemplate_web/iref_ctr/refInfo/",
                data: {
                    refCode: t
                },
                dataType: "json",
                async: !1,
                success: function (t) {
                    t.isMultiSelectedEnabled = !0, t = JSON.stringify(t);
                    var l = {};
                    l = {
                        refmodel: t,
                        refparam: c,
                        type: "string"
                    }, e.meta[a].meta[d].meta[n] = l;
                    var s = $(".input-group", $(o));
                    r.createComp(s[0], i)
                }
            })
        },
        createLoadingAjax: function (e, t) {
            return function () {
                $("#LoadingImage").show(), $("#emptyImage").hide(), $("#LoadingImage").parent().find("table tbody").hide(), $.ajax({
                    type: e.type || "get",
                    dataType: e.dataType || "json",
                    url: e.url,
                    data: e.data || null,
                    success: function (e) {
                        $("#LoadingImage").hide(), $("#LoadingImage").parent().find("table tbody").show(), $("#emptyImage").show(), t(e)
                    },
                    error: function (e) {
                        500 == e.status && "Internal Server Error" == e.responseText && ($("#emptyImage").show(), $("#emptyImage span").html("服务连接错误"), $("#emptyImage span").css({
                            "margin-left": "-46px"
                        })), $("#LoadingImage").hide()
                    }
                })
            }()
        },
        showLoading: function (t) {
            var n = '<div class="save-waiting"><img src="/wbalone/widget/todo/loading.gif" /><span>' + e + "</span></div>";
            t ? document.getElementById(t).appendChild(a.makeDOM(n)) : document.body.appendChild(a.makeDOM(n)), n = '<div class="save-backdrop"></div>', t ? document.getElementById(t).appendChild(a.makeDOM(n)) : document.body.appendChild(a.makeDOM(n))
        },
        hideLoading: function (e) {
            var t;
            if (t = e ? document.getElementById(e).querySelectorAll(".save-waiting,.save-backdrop") : document.querySelectorAll(".save-waiting,.save-backdrop"), e)
                for (var n = 0; n < t.length; n++) document.getElementById(e).removeChild(t[n]);
            else
                for (n = 0; n < t.length; n++) document.body.removeChild(t[n])
        },
        makeDOM: function (e) {
            var t = document.createElement("div");
            t.innerHTML = e;
            var n = t.children[0];
            return n
        },
        changeFocusStyle: function (e, t) {
            var n = $("#" + e),
                i = t ? $("#" + t.inputID) : n.find("input"),
                o = t ? $("#" + t.buttonID) : n.find("button");
            i.focus(function () {
                i.css("border-color", "#6bcaea"), o.css("border-color", "#6bcaea"), o.find("i").css("color", "#b4b4b4")
            }), i.keypress(function (e) {
                o.find("i").css("color", "#6bcaea"), 13 == e.keyCode && o.click()
            }), i.blur(function () {
                i.css("border-color", "#cecece"), o.css("border-color", "#cecece"), o.find("i").css("color", "#b4b4b4")
            })
        },
        printContent: function (e, t) {
            var n = $("body button")[0],
                i = $(n).attr("aria-expanded");
            "true" == i && $(n).click();
            var o = document.createElement("div");
            o.setAttribute("id", t), o.className = "print-content";
            for (var a = document.body.children, d = 0, r = a.length; d < r; d++) "SCRIPT" != a[d].tagName.toUpperCase() && "STYLE" != a[d].tagName.toUpperCase() && (a[d].style.display = "none");
            document.body.appendChild(o);
            var c = $("#" + e)[0].cloneNode(!0);
            for ($(o).html(c), window.print(), d = 0, r = a.length; d < r; d++) "SCRIPT" != a[d].tagName.toUpperCase() && "STYLE" != a[d].tagName.toUpperCase() && (a[d].style.display = "");
            o.remove()
        },
        fadeOutInfo: function (e) {
            var t = document.createElement("div");
            $(t).css({
                position: "fixed",
                top: "10%",
                left: "50%",
                "margin-left": "-70px",
                padding: "0 0 0 20px",
                width: "140px",
                height: "36px",
                "line-height": "36px",
                "background-color": "#f4fff3",
                border: "1px solid #c2e5c8",
                color: "#32aa57"
            });
            var n = '<i style="margin-right: 5px;" class="icon hrfont">&#xe64a;</i>' + e;
            $(t).html(n), document.body.appendChild(t), $(t).fadeOut(3e3)
        },
        formateDate: function (e, t) {
            var n = {
                "M+": e.getMonth() + 1,
                "d+": e.getDate(),
                "h+": e.getHours(),
                "m+": e.getMinutes(),
                "s+": e.getSeconds(),
                "q+": Math.floor((e.getMonth() + 3) / 3),
                S: e.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (var i in n) new RegExp("(" + i + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? n[i] : ("00" + n[i]).substr(("" + n[i]).length)));
            return t
        },
        uiSetParam: function (e, t, n, i) {
            if (null !== i && void 0 !== i) {
                e.setItemCodeValue("headform", t, "", "");
                var o = e.getFieldIdByCode("headform", t);
                o = "edit_" + o;
                var a = $("div#" + o).find("div").first().attr("data-refparam");
                a = JSON.parse(a), a[n] = i, a = JSON.stringify(a), $("div#" + o).find("div").first().attr("data-refparam", a)
            }
        },
        placeholderShiv: function (e, t) {
            var n = "placeholder" in document.createElement("input");
            if (t = t || "red", !n) {
                var i = $("input[placeholder]");
                $.each(i, function (t, n) {
                    n = $(n).attr("placeholder").trim(), n && ($(this).val(n), n == e && $(this).attr({
                        style: "color:red;background-color:#fff"
                    }))
                }), $("input").on("focus", function () {
                    var e = $(this);
                    e.attr("placeholder") === e.val() ? (e.val(""), e.attr("style", 'color:""')) : e.attr("style", 'color:""'), $(this).attr({
                        style: "background-color:#fff"
                    })
                }), $("input").on("blur", function () {
                    var n = $(this),
                        i = n.val().trim(),
                        o = n.attr("placeholder");
                    "" === i ? (o == e ? $(this).attr("style", "color:" + t) : n.attr("style", 'color:""'), n.val(o)) : n.attr("style", 'color:""'), $(this).attr({
                        style: "background-color:#fff"
                    })
                })
            }
        },
        // comboboxInit: function () {
        //     var e = u.Combo.prototype,
        //         t = e.init;
        //     e.init = function () {
        //         t.apply(this, arguments);
        //         var e = this;
        //         this.onlySelect = !0, this.onlySelect && (u.on(this._input, "keydown", function (t) {
        //             8 === t.keyCode || 46 === t.keyCode ? (e.value = "", e._input.value = "", e._updateItemSelect(), e.trigger("select", {
        //                 value: this.value
        //             })) : t.returnValue = !1
        //         }), u.on(this._input, "input", function (t) {
        //             var n = e._ul.querySelector("li.is-selected");
        //             return n ? t.target.value = n.innerText : t.target.value = "", !1
        //         }))
        //     }
        // },
        createZz: function () {
            var e = document.createElement("div");
            return e.id = "conf_overlayer", e.style.cssText = "display: block; position: fixed; top:0%; left: 0%; width:100%; height: 100%; background-color: black; z-index:1090; -moz-opacity: 0; opacity:0; filter: alpha(opacity=0);", document.body.appendChild(e), e
        },
        shortMessage: function (e, t) {
            var n = document.createElement("div");
            n.id = "tempdiv";
            var i = '<div id="shortMsgdiv">' + e + "</div>";
            n.innerHTML = i, document.body.appendChild(n);
            var o = $("#shortMsgdiv")[0].offsetWidth;
            document.body.removeChild(n), o = document.body.clientWidth / 2 - o / 2 - 40, t = isNaN(t) ? 3e3 : t;
            var d = document.createElement("div");
            d.id = "conf_window", d.innerHTML = '<i id="shortMsg-i" class="hrfont">&#xe64a;</i><span id="shortMsg-span">' + e + "</span>", d.style.cssText = "opacity: 0; padding-left:10px; padding-right:10px; background:#F4FFF3; color:#3abe10; height:32px; line-height:32px; text-align:left; border: 1px solid #c2e5c8; position:fixed; top:0px; z-index:1111; left:" + o + "px;", document.body.appendChild(d), $("#conf_window").animate({
                top: "53px",
                opacity: "1.0"
            }, "normal");
            var r = a.createZz();
            setTimeout(function () {
                var e = .5;
                d.style.webkitTransition = "-webkit-transform " + e + "s ease-in, opacity " + e + "s ease-in", d.style.opacity = "0", setTimeout(function () {
                    document.body.removeChild(d), document.body.removeChild(r)
                }, 1e3 * e)
            }, t)
        },
        closeMsg: function () {
            $("#conf_window").animate({
                top: "0",
                opacity: "0"
            }, "normal", function () {
                a.doCancel("conf_window"), a.doCancel("conf_overlayer")
            })
        },
        doCancel: function (e) {
            var t = document.getElementById(e);
            null != t && document.body.removeChild(t)
        },
        warningMessage: function (e) {
            var t = document.createElement("div");
            t.id = "conf_window", e = '<div id="warnmsgdiv"><i class="hrfont warn-i">&#xe63b;</i><span>' + e + '</span></div><i id="warncloseIco" class="hrfont">&#xe60c;</i>', t.innerHTML = e, document.body.appendChild(t);
            var n = document.body.clientWidth / 2 - $("#warnmsgdiv")[0].offsetWidth / 2 - 23;
            document.body.removeChild(t), t.style.cssText = "padding-top:0px; background:#fffef0; opacity:0; color:#000; height:34px; line-height:34px; text-align:left; position:fixed; top:0px; z-index:1111; border: 1px solid #F5CD87; left:" + n + "px;", document.body.appendChild(t), $("#conf_window").animate({
                top: "53px",
                opacity: "1.0"
            }, "normal"), a.createZz(), $("#warncloseIco").on("click", function () {
                this.closeMsg()
            }.bind(this)), $("#conf_overlayer").on("click", function () {
                this.closeMsg()
            }.bind(this))
        },
        errorMessage: function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "提示";
            a.closeMsg();
            var n = null;
            n = null !== t && void 0 !== t && t.length > 0 ? t + "<br/>" : "";
            var i = document.createElement("div");
            i.id = "conf_window";
            var o = '<div id="msgdiv" style="text-align: center; height:32px; line-height:32px; z-index:133; float: left;">' + e + "</div>";
            i.innerHTML = o, document.body.appendChild(i);
            var d = $("#msgdiv")[0].offsetWidth;
            document.body.removeChild(i), d < 450 ? a.errorMsg1(t, e, d) : a.errorMsg2(n, e, d)
        },
        errorMsg1: function (e, t, n) {
            n = document.body.clientWidth / 2 - n / 2 - 55;
            var i = document.createElement("div");
            i.id = "conf_window", t = e + "&nbsp;&nbsp;" + t, t = '<div id="errMsgdiv"><i class="hrfont">&#xe63b;</i><span>' + t + '</span></div><i id="errCloseIco" class="hrfont">&#xe60c;</i>', i.innerHTML = t, i.style.cssText = "opacity: 0; padding-top:0px; background:#fff6f7; color:#000; height:34px; line-height:34px; text-align:left; position:fixed; top:0px; border: 1px solid #F5CD87; z-index:1111; left:" + n + "px;", document.body.appendChild(i), $("#conf_window").animate({
                top: "53px",
                opacity: "1.0"
            }, "normal"), a.createZz(), $("#errCloseIco").on("click", function () {
                this.closeMsg()
            }.bind(this)), $("#conf_overlayer").on("click", function () {
                this.closeMsg()
            }.bind(this))
        },
        errorMsg2: function (e, t, n) {
            var i = document.createElement("div");
            i.id = "conf_window", n = document.body.clientWidth / 2 - 200, t = e + t;
            var o = '<div id="outerdiv"><div class="icon-div"><i class="hrfont">&#xe63b;</i></div><div class="msg-div">' + t + '</div><div class="clo-icon-div"><i id="closeIco" class="hrfont">&#xe60c;</i></div></div>';
            t = o, i.innerHTML = t, i.style.cssText = "opacity: 0; padding-top:0px; background:#fff6f7; color:#000; line-height:34px; text-align:left; position:fixed; border: 1px solid #f8aea9; top:0px; z-index:1111; left:" + n + "px;", document.body.appendChild(i), $("#conf_window").animate({
                top: "53px",
                opacity: "1.0"
            }, "normal"), a.createZz(), $("#closeIco").on("click", function () {
                this.closeMsg()
            }.bind(this)), $("#conf_overlayer").on("click", function () {
                this.closeMsg()
            }.bind(this))
        },
        // confirmDialog: function (e) {
        //     var d, r, c, l, s, f, p;
        //     s = e.msg || "", d = e.title || t, r = e.okText || n, p = e.cancelText || i, c = e.onOk || function () {}, l = e.onCancel || function () {};
        //     var m = "#00afd9";
        //     r === o && (m = "#ff6347");
        //     var g = '<div class="u-msg-dialog" id="u-confirm-dialog"><div class="u-msg-title confirm-title"><div id="titleDiv" class="title">{title}</div><div id="cloDiv" class="closediv"><i id="closeIco" class="hrfont closeicon">&#xe60c;</i></div></div><div class="u-msg-content"><p>{msg}</p></div><div class="u-msg-footer"><button id="cancelbtn" class="u-msg-cancel u-button">{cancelText}</button><button id="okbtn" class="u-msg-ok u-button" style="background:' + m + ';">{okText}</button></div></div>';
        //     f = e.template || g, f = f.replace("{msg}", s), f = f.replace("{title}", d), f = f.replace("{okText}", r), f = f.replace("{cancelText}", p);
        //     var v = a.makeDOM(f),
        //         h = v.querySelector(".u-msg-ok"),
        //         y = v.querySelector(".u-msg-cancel");
        //     new u.Button({
        //         el: h
        //     }), new u.Button({
        //         el: y
        //     }), u.on(h, "click", function () {
        //         c() !== !1 && (document.body.removeChild(v), document.body.removeChild(b))
        //     }), u.on(y, "click", function () {
        //         l() !== !1 && (document.body.removeChild(v), document.body.removeChild(b))
        //     });
        //     var b = u.makeModal(v);
        //     document.body.appendChild(v), this.resizeFun = function () {
        //         var e = v.querySelector(".u-msg-content");
        //         if (e) {
        //             e.style.height = "";
        //             var t = v.offsetHeight,
        //                 n = v.scrollHeight;
        //             n > t && e && (e.style.height = t - 102 + "px")
        //         }
        //     }.bind(this), this.resizeFun(), $("#closeIco").on("click", function () {
        //         document.body.removeChild(v), document.body.removeChild(b)
        //     }.bind(this))
        // },
        getPromise: function (e, t, n) {
            return new Promise(function (i, o) {
                n = n ? n : "get", a.showLoading(), $.ajax({
                    type: n,
                    dataType: "json",
                    data: t,
                    url: e,
                    success: function (e) {
                        a.hideLoading(), 200 == e.statusCode ? i(e.data) : o(e.message)
                    },
                    error: function (e) {
                        a.hideLoading(), o(e.message)
                    }
                })
            })
        }
    };
    return a
});