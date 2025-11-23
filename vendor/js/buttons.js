const btnUp = {
	el: document.querySelector('.floating--top'),
	show() {
		this.el.classList.remove('call-yet');
	},
	hide() {
		this.el.classList.add('call-yet');
	},
	addEventListener() {
		window.addEventListener('scroll', () => {
			const scrollY = window.scrollY || document.documentElement.scrollTop;
			scrollY > 400 ? this.show() : this.hide();
		});
		document.querySelector('.floating--top').onclick = () => {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
		}
	}
}

btnUp.addEventListener();

function toggleElementsOnButtonClick(buttonClass, classesToRemoveHidden) {
	$(buttonClass).on('click', function () {
		const $parent = $(this).parent();
		
		classesToRemoveHidden.forEach(className => {
			$parent.find(`.${className}`).removeClass('hidden');
		});
		
		$(this).addClass('hidden');
	});
}

toggleElementsOnButtonClick('.mobile_cases_details_button', [
	'cases_item_description',
	'cases_item_media',
	'mobile_cases_question_button'
]);

function initToggleActive(containerSelector, itemSelector, activeClass) {
	document.addEventListener('click', function(e) {
		const container = document.querySelector(containerSelector);
		if (container && container.contains(e.target)) {
			const item = e.target.closest(itemSelector);
			if (item && container.contains(item)) {
				container.querySelectorAll(itemSelector).forEach(el => {
					el.classList.remove(activeClass);
				});
				item.classList.add(activeClass);
			}
		}
	});
}

initToggleActive('.blog_marking', '.blog_marking_item', 'blog_marking_item_active');