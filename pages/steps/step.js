;(function($) {
    $.fn.extend({
        //初始化
        loadStep: function(params) {

            //基础框架
            var baseHtml = "<div class='step-container'>" +
                                "<ul class='step-container-steps'>" +
                                "</ul>" +
                                "<div class='step-progress'>" +
                                    "<p class='step-progress-bar'>" +
                                        "<span class='step-progress-highlight' style='width:0%'>" +
                                        "</span>" +
                                    "</p>" +
                                "</div>" +
                            "</div>";
            //步骤框架
            var stepHtml = "<li class='step-step step-step-undone' data-container='body' data-toggle='popover' data-placement='top' data-title='' data-content='' data-trigger='hover'>" +
                "</li>";
            //决策器
            var logic = {
                size: {
                    small: function($html) {
                        var stepCount = $html.find("li").length - 1,
                            containerWidth = (stepCount * 65 + 100) + "px",
                            progressWidth = (stepCount * 65) + "px";
                        $html.css({
                            width: containerWidth
                        });
                        $html.find(".step-progress").css({
                            width: progressWidth
                        });
                        $html.find(".step-progress-bar").css({
                            width: progressWidth
                        });
                        $html.addClass("step-sm");
                    },
                    large: function($html) {
                        var stepCount = $html.find("li").length - 1,
                            containerWidth = (stepCount * 100 + 100) + "px",
                            progressWidth = (stepCount * 100) + "px";
                        $html.css({
                            width: containerWidth
                        });
                        $html.find(".step-progress").css({
                            width: progressWidth
                        });
                        $html.find(".step-progress-bar").css({
                            width: progressWidth
                        });
                        $html.addClass("step-lg");
                    }
                },
                color: {
                    green: function($html) {
                        $html.addClass("step-green");
                    },
                    blue: function($html) {
                        $html.addClass("step-blue");
                    }
                }
            };

            //支持填充多个步骤容器
            $(this).each(function(i, n) {
                var $baseHtml = $(baseHtml),
                    $stepHtml = $(stepHtml),
                    $stepContainerSteps = $baseHtml.find(".step-container-steps"),
                    arrayLength = 0,
                    $n = $(n),
                    i = 0;

                //步骤
                arrayLength = params.steps.length;
                for (i = 0; i < arrayLength; i++) {
                    var _s = params.steps[i];
                    //构造步骤html
                    $stepHtml.attr("data-title", _s.title);
                    $stepHtml.attr("data-content", _s.content);
                    $stepHtml.text(_s.title);
                    //将步骤插入到步骤列表中
                    $stepContainerSteps.append($stepHtml);
                    //重置步骤
                    $stepHtml = $(stepHtml);
                }

                //尺寸
                logic.size[params.size || "small"]($baseHtml);
                //配色
                logic.color[params.color || "green"]($baseHtml);

                //插入到容器中
                $n.append($baseHtml);
                //渲染提示气泡
                $n.find(".step-step").popover({});
                //默认执行第一个步骤
                $n.setStep(1);
            });
            return this;
        },
        //跳转到指定步骤
        setStep: function(step) {
            $(this).each(function(i, n) {
                //获取当前容器下所有的步骤
                var $steps = $(n).find(".step-container").find("li");
                var $progress = $(n).find(".step-container").find(".step-progress-highlight");
                //判断当前步骤是否在范围内
                if (1 <= step && step <= $steps.length) {
                    //更新进度
                    var scale = "%";
                    scale = Math.round((step - 1) * 100 / ($steps.length - 1)) + scale;
                    $progress.animate({
                        width: scale
                    }, {
                        speed: 1000,
                        done: function() {
                            //移动节点
                            $steps.each(function(j, m) {
                                var _$m = $(m);
                                var _j = j + 1;
                                if (_j < step) {
                                    _$m.attr("class", "step-step-done");
                                } else if (_j === step) {
                                    _$m.attr("class", "step-step-active");
                                } else if (_j > step) {
                                    _$m.attr("class", "step-step-undone");
                                }
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //获取当前步骤
        getStep: function() {
            var result = [];

            $(this)._searchStep(function(i, j, n, m) {
                result.push(j + 1);
            });

            if (result.length == 1) {
                return result[0];
            } else {
                return result;
            }
        },
        //下一步
        nextStep: function() {
            $(this)._searchStep(function(i, j, n, m) {
                $(n).setStep(j + 2);
            });
        },
        //上一步
        prevStep: function() {
            $(this)._searchStep(function(i, j, n, m) {
                $(n).setStep(j);
            });
        },
        //通用节点查找
        _searchStep: function(callback) {
            $(this).each(function(i, n) {
                var $steps = $(n).find(".step-container").find("li");
                $steps.each(function(j, m) {
                    //判断是否为活动步骤
                    if ($(m).attr("class") === "step-step-active") {
                        if (callback) {
                            callback(i, j, n, m);
                        }
                        return false;
                    }
                });
            });
        }
    });
})(jQuery);
