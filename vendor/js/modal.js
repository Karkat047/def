class ModalManager {
	constructor(options = {}) {
		this.options = {
			openClass: 'open_modal',
			closeClass: 'close-modal',
			modalClass: 'modal',
			activeClass: 'active',
			bodyLockClass: 'body-lock',
			animationDuration: 300,
			closeOnOverlay: true,
			...options
		};
		
		this.modalsStack = [];
		this.init();
	}
	
	init() {
		$(document).on('click', `[data-modal]`, (e) => {
			e.preventDefault();
			const modalId = $(e.currentTarget).data('modal');
			this.open(modalId);
		});
		
		$(document).on('click', `.${this.options.closeClass}`, (e) => {
			e.preventDefault();
			this.close();
		});
		
		if (this.options.closeOnOverlay) {
			$(document).on('click', `.${this.options.modalClass}`, (e) => {
				if (e.target === e.currentTarget) {
					this.close();
				}
			});
		}
		
		$(document).on('keydown', (e) => {
			if (e.key === 'Escape' && this.modalsStack.length > 0) {
				this.close();
			}
		});
	}
	
	open(modalId) {
		const modal = $(`#${modalId}`);
		
		if (!modal.length) {
			return;
		}
		
		const baseZIndex = 9999;
		const newZIndex = baseZIndex + this.modalsStack.length;
		
		if (this.modalsStack.length === 0) {
			$('body').addClass(this.options.bodyLockClass);
		}
		
		modal.css('z-index', newZIndex);
		modal.removeClass('hidden').addClass(this.options.activeClass);
		this.modalsStack.push(modal);
	}
	
	close() {
		if (this.modalsStack.length === 0) return;
		
		const modalToClose = this.modalsStack.pop();

		if (modalToClose.attr('id') === 'media_modal' && typeof window.resetMediaModal === 'function') {
			window.resetMediaModal();
		}
		
		modalToClose.removeClass(this.options.activeClass);
		
		setTimeout(() => {
			modalToClose.addClass('hidden');
		}, this.options.animationDuration);
		
		if (this.modalsStack.length === 0) {
			$('body').removeClass(this.options.bodyLockClass);
		}
	}
}

const modalManager = new ModalManager();
window.modalManager = modalManager;


const $modal = $('#media_modal');
const $contentContainer = $modal.find('.media_modal_content_container');
const $track = $modal.find('.media_track');
const $items = $modal.find('.media_modal_content_item');
const totalItems = $items.length;
let currentIndex = 0;

const $prevButton = $modal.find('.media_modal_nav_button.prev');
const $nextButton = $modal.find('.media_modal_nav_button.next');
const $countElement = $modal.find('.media_modal_header_media_count');
const $zoomButton = $modal.find('.media_modal_zoom_button');
const $zoomInIcon = $modal.find('.media_modal_zoom-in');
const $zoomOutIcon = $modal.find('.media_modal_zoom-out');

let isZoomActive = false;
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;
const ZOOM_SCALE = 1.5;

const $activeItem = () => $items.eq(currentIndex);


function updateSlider() {
	$countElement.text(`${currentIndex + 1}/${totalItems}`);
	const offset = -currentIndex * 100;
	$track.css('transform', `translateX(${offset}%)`);
	
	$prevButton.toggleClass('hidden', currentIndex === 0);
	$nextButton.toggleClass('hidden', currentIndex === totalItems - 1);
	
	$items.removeClass('active').eq(currentIndex).addClass('active');
	
	if (isZoomActive) {
		toggleZoom(false);
	}
}

function toggleZoom(forceState) {
	isZoomActive = forceState !== undefined ? forceState : !isZoomActive;
	
	$contentContainer.toggleClass('zoom-active', isZoomActive);
	$zoomButton.attr('data-zoom-active', isZoomActive);
	
	$zoomInIcon.toggleClass('hidden', isZoomActive);
	$zoomOutIcon.toggleClass('hidden', !isZoomActive);
	
	const $item = $activeItem();
	const $img = $item.find('img, video, iframe');
	
	if (isZoomActive) {
		$img.css({
			'transform': `scale(${ZOOM_SCALE})`,
			'transform-origin': '-100% 50%'
		});

		const imgEl = $img.get(0);

		const imgWidth = imgEl.naturalWidth || imgEl.offsetWidth;
		const imgHeight = imgEl.naturalHeight || imgEl.offsetHeight;
		
		const containerWidth = $item.width();
		const containerHeight = $item.height();

		const scrollX = (imgWidth * ZOOM_SCALE - containerWidth) / 2;
		const scrollY = (imgHeight * ZOOM_SCALE - containerHeight) / 2;
		
		$item.scrollLeft(scrollX > 0 ? scrollX : 0);
		$item.scrollTop(scrollY > 0 ? scrollY : 0);
		
		$item.css('cursor', 'grab');
		$prevButton.addClass('hidden');
		$nextButton.addClass('hidden');
		
	} else {

		$img.css({
			'transform': 'none',
			'transform-origin': 'initial'
		});
		
		$item.scrollLeft(0).scrollTop(0).css('cursor', 'default');
		
		$prevButton.toggleClass('hidden', currentIndex === 0);
		$nextButton.toggleClass('hidden', currentIndex === totalItems - 1);
	}
}

function stopVideos() {
	$modal.find('iframe').each(function() {
		const tempSrc = $(this).attr('src');
		if (tempSrc) {
			$(this).attr('src', '');
			$(this).attr('src', tempSrc);
		}
	});
	
	$modal.find('video').each(function() {
		this.pause();
		this.currentTime = 0;
	});
}

window.resetMediaModal = function() {
	stopVideos();
	if (isZoomActive) {
		toggleZoom(false);
	}
	currentIndex = 0;
	updateSlider();
}

window.resetMediaModal = function() {
	stopVideos();

	if (isZoomActive) {
		toggleZoom(false);
	} else {
		currentIndex = 0;
		updateSlider();
	}

}

$items.on('mousedown', function(e) {
	if (!isZoomActive || !$(this).is('.active')) return;
	
	isDragging = true;
	const $item = $(this);
	$item.css('cursor', 'grabbing');
	
	startX = e.pageX;
	scrollLeft = $item.scrollLeft();
	startY = e.pageY;
	scrollTop = $item.scrollTop();
});

$(document).on('mouseup', function() {
	if (!isDragging || !isZoomActive) return;
	
	isDragging = false;
	$activeItem().css('cursor', 'grab');
});

$items.on('mousemove', function(e) {
	if (!isDragging || !isZoomActive || !$(this).is('.active')) return;
	e.preventDefault();
	
	const $item = $(this);
	
	const x = e.pageX;
	const walkX = (x - startX);
	$item.scrollLeft(scrollLeft - walkX);
	
	const y = e.pageY;
	const walkY = (y - startY);
	$item.scrollTop(scrollTop - walkY);
});

$nextButton.on('click', () => {
	if (currentIndex < totalItems - 1) {
		currentIndex++;
		updateSlider();
	}
});

$prevButton.on('click', () => {
	if (currentIndex > 0) {
		currentIndex--;
		updateSlider();
	}
});

$zoomButton.on('click', () => toggleZoom());


updateSlider();