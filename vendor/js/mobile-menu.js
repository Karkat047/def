const menuHistory = [];

function initMobileMenu() {
	const $menu = $('.mobile_menu_container');
	const $overlay = $('.mobile_menu_overlay');
	const $menuBtn = $('.mobile_menu_button');
	const $closeBtn = $('.close_mobile_menu');
	const $menuContext = $('.mobile_menu_context');
	
	function closeMenu() {
		$menu.removeClass('active');
		$overlay.fadeOut(300);
	}

	$menuBtn.on('click', function() {
		$menu.addClass('active');
		$overlay.fadeIn(300);
		resetMenuToRoot();
	});

	$closeBtn.on('click', closeMenu);
	$overlay.on('click', closeMenu);
	
	/**
	 * Сброс меню до корневого состояния (Уровень 0)
	 */
	function resetMenuToRoot() {
		// Скрываем все списки, кроме корневого (data-level="0")
		$menuContext.find('.menu-list').hide();
		$menuContext.find('.menu-list[data-level="0"]').show();
		menuHistory.length = 0; // Очищаем историю
		// Удаляем все временные кнопки Назад, которые могли остаться
		$menuContext.find('.menu-back-item').remove();
	}
	
	/**
	 * Показать подменю по ID
	 * @param {string} targetId - ID родительского элемента, который открывает подменю.
	 * @param {string} parentText - Текст родительского элемента для кнопки "Назад".
	 */
	function showSubMenu(targetId, parentText) {
		const $currentVisibleList = $menuContext.find('.menu-list:visible');
		const $subList = $menuContext.find(`.menu-list[data-parent="${targetId}"]`);
		
		if ($subList.length) {
			menuHistory.push({
				parentId: targetId,
				title: parentText
			});

			$currentVisibleList.hide();

			const $backButton = $(`<a class="menu-back-item"><i class="arrow_left_menu">‹</i> ${parentText}</a>`);
			$backButton.on('click', hideCurrentSubMenu);
			
			$subList.prepend($backButton);

			$subList.show();

			$menuContext.scrollTop(0);
		}
	}
	
	/**
	 * Возврат назад (обработчик для .menu-back-item)
	 */
	function hideCurrentSubMenu() {
		if (menuHistory.length === 0) return;
		
		const $currentList = $(this).closest('.menu-list');

		$(this).remove();
		$currentList.hide();

		menuHistory.pop();

		if (menuHistory.length === 0) {
			resetMenuToRoot();
		} else {
			const previousItem = menuHistory[menuHistory.length - 1];
			const $parentList = $menuContext.find(`.menu-list[data-parent="${previousItem.parentId}"]`).length
				? $menuContext.find(`.menu-list[data-parent="${previousItem.parentId}"]`) // Если это не уровень 0
				: $menuContext.find(`.menu-list[data-level="0"]`); // Если предыдущий - это уровень 0

			$parentList.show();

			$menuContext.scrollTop(0);
		}
	}

	$menuContext.on('click', '.menu-item', function(e) {
		const $item = $(this);
		const target = $item.data('target');
		const href = $item.attr('href');
		
		if (target) {
			e.preventDefault()

			const parentText = $item.find('.menu-item-text').text().trim();
			showSubMenu(target, parentText);
		} else {
			closeMenu();
		}
	});

	$menu.data('closeMenu', closeMenu);
}

initMobileMenu();