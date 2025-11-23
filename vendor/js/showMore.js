function initShowMore({
    container,
    items,
    button,
    step = 4,
    breakpoint = 1023,
    isResetOnResize = false
}) {
    const $container = $(container);
    const $items = $container.find(items);
    const $button = $(button);

    let total = $items.length;
    let visibleCount = step;
    let wasBelowBreakpoint = null;

    function isBelowBreakpoint() {
        return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    }

    function update() {
        const below = isBelowBreakpoint();

        if (below !== wasBelowBreakpoint && isResetOnResize) {
            visibleCount = step;
        }
        wasBelowBreakpoint = below;

        if (!below) {
            $items.removeClass('hidden');
            $button.addClass('hidden');
            return;
        }

        $items.addClass('hidden');
        $items.slice(0, visibleCount).removeClass('hidden');

        if (total <= visibleCount) {
            $button.addClass('hidden');
        } else {
            $button.removeClass('hidden');
        }
    }

    $button.off('click').on('click', function () {
        visibleCount += step;
        update();
    });

    visibleCount = step;
    update();

    $(window).off(`resize.showMore.${container}`).on(`resize.showMore.${container}`, () => update());
}

initShowMore({
    container: '.team_content',
    items: '.team_column',
    button: '#team-section-more-button',
    step: 1,
    isResetOnResize: true,
});