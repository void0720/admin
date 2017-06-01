/**
*   author: wangyajun
*   date: 2017-04-12
*   version: 1.1.1
*/
//++++++++++++++++用法：++++++++++++++++++++++++++++++++++
//<div class="inputControl">
//     <input type="text" class="required" name="user" data-tip="请输入您的用户名"
//     data-valid="isNonEmpty||onlyZh||between:2-6" data-error="用户名不能为空||用户名只能为中文||用户名长度为2-6位">
// </div>

//是否需要校验：  输入框是：class="required",单选框或者多选框是：class="isChecked"
//校验规则：     data-valid="RULES内的规则"，可以多个串联，用||连接
//聚焦后的提示： data-tip="提示语"
//错误提示：     data-error="提示语"
//复选框或者单选框：data-ytpe="checkbox",checkbox或者radio
//

!(function ($) {
    //校验规则
    var RULES = {
        //不能为空
        isNonEmpty: function(value, errorMsg) {
            console.log(value);
            if (!value.length) {
                return errorMsg;
            }
        },
        //大于
        minLength: function(value, length, errorMsg) {
            if (value.length < length) {
                return errorMsg;
            }
        },
        //小于
        maxLength: function(value, length, errorMsg) {
            if (value.length < length) {
                return errorMsg;
            }
        },
        //是否为手机号码
        isMobile: function(value, errorMsg) {
            if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                return errorMsg;
            }
        },
        //是否为邮箱
        isEmail: function(value, errorMsg) {
            if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
                return errorMsg;
            }
        },
        //长度大于小于
        between: function(value, range, errorMsg) {
            var min = parseInt(range.split('-')[0]);
            var max = parseInt(range.split('-')[1]);
            if (value.length < min || value.length > max) {
                return errorMsg;
            }
        },
        //只能输入英文
        onlyEn: function(value, errorMsg) {
            if (!/^[A-Za-z]+$/.test(value)) {

            }
        },
        //只能输入中文
        onlyZh: function(value, errorMsg) {
            if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
                return errorMsg;
            }
        },
        //数字包含小数
        onlyNum: function(value, errorMsg) {
            if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
                return errorMsg;
            }
        },
        //只能输入整数
        onlyInt: function(value, errorMsg) {
            if (!/^[0-9]*$/.test(value)) {
                return errorMsg;
            }
        },
        //checkbox radio 是否选中
        isChecked: function(value, errorMsg, el) {
            var i = 0;
            var $collection = $(el).find('input:checked');
            if(!$collection.length){
                return errorMsg;
            }
        }
    };

    //Validator类
    var setting = {
        type: null,
        onBlur: null,
        onFocus: null,
        onChange: null,
        successTip: true
    };

    var Validator = function() {
        this.cache = [];
    };

    Validator.prototype.add = function(dom, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function(rule) {
                var strategyAry = rule.strategy.split(':');
                var errorMsg = rule.errorMsg
                self.cache.push(function() {
                    var strategy = strategyAry.shift(); // 从前面删匹配方式并赋值
                    strategyAry.unshift(dom.value); // 从前插value值
                    strategyAry.push(errorMsg); // 从后插出错提示
                    strategyAry.push(dom); // 从后插dom

                    //没有的校验规则
                    if (!RULES[strategy]) {
                        $.error('程序哥哥还没写' + strategy + '校验规则哦');
                    }
                    return {
                        errorMsg: RULES[strategy].apply(dom, strategyAry),
                        el: dom
                    };
                });
            }(rule));
        }
    };

    Validator.prototype.start = function() {
        var result;
        for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            var result = validatorFunc();
            if (setting.successTip) {
                new Validator().showMsg($(result.el), '', 1);
            }
            if (result.errorMsg) {
                return result;
            }

        };
        return true;
    };

    Validator.prototype.showMsg = function(target, msg, status, callback) {
        //status =>  0 : tip , 1 : success , 2 : error
        var _current = status ? (status > 1 ? 'error' : 'success') : 'tip';
        var $context = target.parent();
        var $msg = $context.find('.valid_message');
        var _other = target.attr('data-type') || '';
        $msg.remove();
        $context.removeClass('success tip error')
                .addClass(_current+' '+_other)
                .append('<span class="valid_message">' + msg + '</span>');
    };

    var plugin = {
        init: function(options) {
            var $form = this;
            var $body = $('body');
            var $required = $form.find('.required');
            setting = $.extend(setting, options);
            if (setting.type) {
                $.extend(RULES, setting.type);
            }
            var validator = new Validator();

            $body.on({
                focus: function(event) {
                    var $this = $(this);
                    var _tipMsg = $this.attr('data-tip') || '';
                    var _status = $this.attr('data-status');
                    if (_status === undefined ||!parseInt(_status)) {
                        validator.showMsg($this, _tipMsg);
                    }
                    setting.onFocus ? setting.onFocus.call($this, arguments) : '';
                },
                blur: function(event) {
                    var $this = $(this);
                    var dataValid = $this.attr('data-valid');
                    var validLen = dataValid.split('||');
                    var errCollection = $this.attr('data-error');
                    var errMsgAry = errCollection.split("||");
                    var strategyAry, strategy, errMsg;

                    for (var i = 0; i < validLen.length; i++) {
                        strategyAry = validLen[i].split(':');
                        strategy = strategyAry.shift();
                        strategyAry.unshift(this.value);
                        strategyAry.push(errMsgAry[i]);
                        strategyAry.push(this);
                        errMsg = RULES[strategy].apply(this, strategyAry);
                        if (errMsg) {
                            $this.attr('data-status', 0);
                            validator.showMsg($this, errMsg, 2);
                            break;
                        }
                    };
                    if (!errMsg) {
                        $this.attr('data-status', 1);
                        setting.successTip ? validator.showMsg($this, '', 1) : $this.parent().find('.valid_message').remove();
                    }
                    setting.onBlur ? setting.onBlur.call($this, arguments) : '';
                },
                change: function(event) {
                    setting.onChange ? setting.onChange.call($this, arguments) : '';
                }
            }, '.required');
        },
        submitValidate: function(options) {
            var $form = options || this;
            var $body = $('body');
            var $required = $form.find('.required');
            var validator = new Validator();
            var $target;

            $.each($required, function(index, el) {
                var $el = $(el);
                var dataValid = $el.attr('data-valid');
                var validLen = dataValid.split('||');
                var errCollection = $el.attr('data-error');
                var errMsgAry = errCollection.split("||");
                var ruleAry = [];

                for (var i = 0; i < validLen.length; i++) {
                    ruleAry.push({
                        strategy: validLen[i],
                        errorMsg: errMsgAry[i]
                    });
                };
                validator.add(el, ruleAry);
            });

            var result = validator.start();
            if (result.errorMsg) {
                $target = $(result.el);
                //$target.attr('data-status', 0)[0].focus();
                validator.showMsg($target, result.errorMsg, 2);
                return false;
            }
            return true;
        }
    }

    $.fn.validate = function() {
        var method = arguments[0];
        if (plugin[method]) {
            method = plugin[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = plugin.init;
        } else {
            $.error('程序哥哥还没写' + method + ' 方法哦');
            return this;
        }
        return method.apply(this, arguments);
    }


})(jQuery);
