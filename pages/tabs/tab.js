//标签页
// Author:wangyajun
// Date:2017.5.06
/**
一、初始化tabs:
	$(selector).initTabs();

二、添加:
	$(selector).addTab(title,content);
	参数:(标题[string],内容[string])

三、删除功能:
	添加属性：data-close="true"

四、卡片样式:
	添加class：tabs-tab-card
**/

;(function($){

	$.fn.extend({
		//初始化
		initTabs: function(){
			var _this = $(this),
				isDelate = _this.attr("data-close"),
				$tab = _this.find('.tabs-tab-title li'),
				closeStr = '<span class="tabs-icon tabs-unselect tabs-tab-close">x</span>';

			_this.addClass('tabs-tab');
			$tab.off('click');
			_this.on('click', $tab, function(e) {

				e.preventDefault();
				// event.stopPropagation();

				var _tab = $(e.target),
					_isTab =
					index = _tab.index();

				_tab.addClass('tabs-this').siblings('li').removeClass('tabs-this');
				_this.find('.tabs-tab-item').eq(index).addClass('tabs-show').siblings('.tabs-tab-item').removeClass('tabs-show');
			});

			//删除图标以及功能
			if(isDelate) {
				$tab.append(closeStr);
				var num = 0,tar = 0,
					$item = _this.find('.tabs-tab-item'),
					$close = _this.find('.tabs-tab-close');

				_this.find('.tabs-tab-title').addClass('tabs-tab-more');

				$tab.each(function(index, el) {
					$(el).attr('data-href',num++);
					$item.eq(index).attr('data-target',tar++);
				});

				$close.off('click');
				_this.on('click', $close, function(event) {
					event.preventDefault();
					event.stopPropagation();

					var eThis = $(event.target),
						isTarget = eThis.hasClass('tabs-tab-close');

					if(isTarget) {
						var _li = eThis.closest('li'),
							i = _li.attr('data-href'),
							_class = _li.hasClass('tabs-this'),
							len = _li.next('li').length,
							item = _this.find('.tabs-tab-item[data-target="'+i+'"]');

						if (_class) {
							if (len) {
								_li.next('li').addClass('tabs-this');
								item.next().addClass('tabs-show').siblings('.tabs-tab-item').removeClass('tabs-show');
							}else{
								_li.prev('li').addClass('tabs-this');
								item.prev().addClass('tabs-show').siblings('.tabs-tab-item').removeClass('tabs-show');
							}
						}else{
							var n = _this.find('li.tabs-this').attr('data-href'),
								$it = _this.find('.tabs-tab-item[data-target="'+n+'"]');
							$it.addClass('tabs-show').siblings('.tabs-tab-item').removeClass('tabs-show');
						}
						_li.remove();
						item.remove();
					}else{
						return false;
					}
				});
			}
		},
		//添加
		addTab: function(title,content){

			var _this = $(this),
				_title = _this.find('.tabs-tab-title'),
				b = _this.attr("data-close"),
				lis = _title.find('li');

			if (!b) {
				_title.append('<li data-href='+lis.length+'>'+title+'</li>');
			}else{
				_title.append('<li data-href='+lis.length+'>'+title+'<span class="tabs-icon tabs-unselect tabs-tab-close">x</span>'+'</li>');
			}

			_this.find('.tabs-tab-content').append('<div class="tabs-tab-item" data-target='+lis.length+'>'+content+'</div>');

		}
	});

})(jQuery);
