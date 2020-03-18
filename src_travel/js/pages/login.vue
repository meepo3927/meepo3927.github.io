<template>
<div class="login-box" n="~!@#$">
    <div>
        <div class="text-center">
            <h2 class="font-bold">东方万里 | 智慧旅游</h2>
        </div>
        <form :action="fmAction" @submit.prevent ref="form">
            <div class="form-group">
                <label>用户名：</label>
                <input type="text" class="form-control" required
                    placeholder="请输入用户名" name="user_id"
                    @keyup="onUserNameKeyUp"
                    v-model.trim="userName" />
            </div>
            <div class="form-group">
                <label>密码：</label>
                <input type="password" class="form-control" placeholder="请输入密码"
                    ref="password" required
                    @keyup="onPasswordKeyUp"
                    v-model="password" />
                <input type="hidden" name="user_pwd" :value="encodedPassword" />
            </div>
            <div class="form-group">
                <label>验证码：</label>
                <img :src="captchaSrc" class="captcha-img" />
                <input type="text" class="form-control check-code" 
                    placeholder="请输入验证码" name="checkCode" 
                    ref="checkCode"
                    @keyup="onCheckCodeKeyUp" 
                    v-model.trim="checkCode" />
                <input type="hidden" name="tourl" :value="toUrl"/>
            </div>
            <div class="login-tip" v-show="loginTip">
                <span v-text="loginTip"></span>
            </div>
            <div class="btn-box">
                <button type="button" class="btn btn-primary" 
                    @click="onSubmitClick">登录</button>
            </div>

        </form>
    </div>
</div>
</template>

<script>
import URL from 'util/url.js';
import AES from 'util/aes.js';
import mlayer from 'mlayer';
const I = '-';
const Q = URL.query();
const methods = {};
methods.onSubmitClick = function () {
    if (!this.userName) {
        return mlayer.msg('请输入用户名');
    }
    if (!this.password) {
        return mlayer.msg('请输入密码');
    }
    if (!this.checkCode) {
        return mlayer.msg('请输入验证码');
    }
    this.submit();
};
methods.onUserNameKeyUp = function (e) {
    if (e.keyCode === 13 && this.userName) {
        this.$refs.password.focus();
    }
};
methods.onPasswordKeyUp = function (e) {
    if (e.keyCode === 13 && this.password) {
        this.$refs.checkCode.focus();
    }
};
methods.onCheckCodeKeyUp = function (e) {
    if (e.keyCode === 13 && this.checkCode) {
        this.onSubmitClick();
    }
};
methods.getNum = function () {
    if (this.$el.hasAttribute('n')) {
        this.NUM = this.$el.getAttribute('n');
        this.$el.removeAttribute('n');
    }
    return this.NUM;
};
methods.submit = function () {
    this.$refs.form.submit();
};
methods.particlesStart = function () {
    if (!window.particlesJS) {
        return;
    }
    particlesJS('particles', {
        'particles': {
            'number': {
                'value': 80,
                'density': {
                    'enable': true,
                    'value_area': 800
                }
            },
            'color': {
                'value': '#ffffff'
            },
            'shape': {
                'type': 'circle',
                'stroke': {
                    'width': 0,
                    'color': '#000000'
                },
                'polygon': {
                    'nb_sides': 5
                },
                'image': {
                    'src': 'img/github.svg',
                    'width': 100,
                    'height': 100
                }
            },
            'opacity': {
                'value': 0.5,
                'random': false,
                'anim': {
                    'enable': false,
                    'speed': 1,
                    'opacity_min': 0.1,
                    'sync': false
                }
            },
            'size': {
                'value': 3,
                'random': true,
                'anim': {
                    'enable': false,
                    'speed': 40,
                    'size_min': 0.1,
                    'sync': false
                }
            },
            'line_linked': {
                'enable': true,
                'distance': 150,
                'color': '#ffffff',
                'opacity': 0.4,
                'width': 1
            },
            'move': {
                'enable': true,
                'speed': 2,
                'direction': 'none',
                'random': false,
                'straight': false,
                'out_mode': 'out',
                'bounce': false,
                'attract': {
                    'enable': false,
                    'rotateX': 600,
                    'rotateY': 1200
                }
            }
        },
        'interactivity': {
            'detect_on': 'canvas',
            'events': {
                'onhover': {
                    'enable': false,
                    'mode': 'grab'
                },
                'onclick': {
                    'enable': false,
                    'mode': 'push'
                },
                'resize': true
            },
            'modes': {
                'grab': {
                    'distance': 140,
                    'line_linked': {
                        'opacity': 1
                    }
                },
                'bubble': {
                    'distance': 400,
                    'size': 40,
                    'duration': 2,
                    'opacity': 8,
                    'speed': 3
                },
                'repulse': {
                    'distance': 200,
                    'duration': 0.4
                },
                'push': {
                    'particles_nb': 4
                },
                'remove': {
                    'particles_nb': 2
                }
            }
        },
        'retina_detect': true
    });
};
const computed = {};
computed.encodedPassword = function () {
    if (this.password) {
        // console.log(this.g);
        return AES.p(this.password, this.g);
    }
};
computed.fmAction = function () {
    return '/index.html';
};
computed.loginTip = function () {
    if (Q.msg) {
        return decodeURIComponent(Q.msg);
    }
};
computed.toUrl = function () {
    return Q.tourl;
};
computed.g = function () {
    return ['TR', 'AV', 'EL','20', '19'].join('') + I + this.getNum();
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.particlesStart();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        userName: '',
        password: '',
        checkCode: '',
        captchaSrc: '/images/checkCode.jpg'
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.login-box {
    width: 300px;
    position: fixed;
    left: 50%;
    top: 42%;
    margin-left: -150px;
    margin-top: -150px;
}
h2.font-bold {
    color: #333;
}
.login-link-box a {
    font-size: 16px;
    color: #555fff;
}
.login-link-box a:hover {
    color: #00eeee;
}
.login-link-box a > .fa {
    font-size: 18px;
    vertical-align: -1px;
}
.check-code {
    width: 160px;
}
.captcha-img {
    float: right;
    height: 34px;
    margin-top: 28px;
    margin-right: 2px;
}
.form-group > label {
    font-size: 16px;
    color:  #666;
}
.btn-box {
    margin-top: 15px;
    margin-bottom: 15px;
}
.btn-primary {
    width: 100%;
}
.login-tip {
    text-align: center;
    margin-top: 5px;
    color: #f00;
    font-size: 16px;
}
</style>
<style lang="less">
.particles {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    font-size: 0;
}
</style>