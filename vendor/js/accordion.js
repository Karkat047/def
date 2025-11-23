$(document).ready(function () {
	function initAccordion({
		container,
		button,
		activeClass = 'accordion-open',
		maxWidth = null,
		minWidth = null,
		isSingleOpen = false,
		isInitiallyOpen = false,
		iconClassOpen = 'icon-open',
		iconClassClosed = 'icon-closed'
	}) {
		const $items = $(container);
		
		function toggle($item) {
			const $btn = $item.find(button).first();
			const $icon = $btn.find('i');
			const $content = $item.children().not($btn);
			
			const isOpen = $item.hasClass(activeClass);
			
			if (isSingleOpen) {
				$items.removeClass(activeClass);
				$items.each(function () {
					const $el = $(this);
					const $btnEl = $el.find(button).first();
					const $iconEl = $btnEl.find('i');
					const $contentEl = $el.children().not($btnEl);
					
					$contentEl.hide();
					$iconEl.removeClass(iconClassOpen).addClass(iconClassClosed);
				});
			}
			
			if (isOpen) {
				$item.removeClass(activeClass);
				$content.hide();
				$icon.removeClass(iconClassOpen).addClass(iconClassClosed);
			} else {
				$item.addClass(activeClass);
				$content.show();
				$icon.removeClass(iconClassClosed).addClass(iconClassOpen);
			}
		}
		
		function init() {
			const shouldWork =
				(!maxWidth || window.innerWidth <= maxWidth) &&
				(!minWidth || window.innerWidth >= minWidth);
			
			if (!shouldWork) {
				$items.each(function () {
					const $item = $(this);
					const $btn = $item.find(button).first();
					const $icon = $btn.find('i');
					const $content = $item.children().not($btn);
					
					$item.removeClass(activeClass);
					$content.show();
					$icon.removeClass(iconClassOpen).addClass(iconClassClosed);
					$btn.off('click.accordion');
				});
				return;
			}

			$items.each(function () {
				const $item = $(this);
				const $btn = $item.find(button).first();
				const $icon = $btn.find('i');
				const $content = $item.children().not($btn);
				
				if (isInitiallyOpen) {
					$item.addClass(activeClass);
					$content.show();
					$icon.removeClass(iconClassClosed).addClass(iconClassOpen);
				} else {
					$item.removeClass(activeClass);
					$content.hide();
					$icon.removeClass(iconClassOpen).addClass(iconClassClosed);
				}
				
				$btn.off('click.accordion').on('click.accordion', function () {
					toggle($item);
				});
			});
		}
		
		init();
		$(window).on('resize', init);
	}

	initAccordion({
		container: '.question_item',
		button: '.question_item_title',
		activeClass: 'question_active_item',
		isSingleOpen: true,
		isInitiallyOpen: false,
		iconClassOpen: 'cross_icon',
		iconClassClosed: 'plus_icon'
	});

	initAccordion({
		container: '.footer_menu_list_item',
		button: '.footer_menu_list_title',
		activeClass: 'footer_menu_list_active_item',
		isSingleOpen: true,
		isInitiallyOpen: false,
		iconClassOpen: 'arrow_up',
		iconClassClosed: 'arrow_button'
	});


	function initReadMoreToggle({
		buttonSelector,
		wrapperSelector,
		expandText = "Свернуть",
		collapseText = "Читать дальше"
	}) {
		const $button = $(buttonSelector);
		const $wrapper = $(wrapperSelector);
		
		$button.on("click", function () {
			$wrapper.toggleClass("expanded");
			
			if ($wrapper.hasClass("expanded")) {
				$button.text(expandText);
			} else {
				$button.text(collapseText);
			}
		});
	}
	
	initReadMoreToggle({
		buttonSelector: ".SEO_read_more_button",
		wrapperSelector: ".SEO_text_wrapper"
	});
});
