function initializeMultiStepForm(formSelector, stepSelectors, nextButtonSelector, stepIndicatorSelector) {
	const $form = $(formSelector);
	const $stepIndicator = $form.find(stepIndicatorSelector);
	
	if ($form.length === 0 || stepSelectors.length === 0 || $stepIndicator.length === 0) {
		return;
	}
	
	let currentStepIndex = 0;
	const totalSteps = stepSelectors.length;

	function showStep(index) {
		stepSelectors.forEach((selector, i) => {
			$(selector).hide().attr('aria-hidden', 'true');
		});

		const currentStepSelector = stepSelectors[index];
		$(currentStepSelector).show().attr('aria-hidden', 'false');
		
		updateStepIndicator();
	}

	function updateStepIndicator() {
		if ($stepIndicator.length) {
			$stepIndicator.text(`Шаг ${currentStepIndex + 1} из ${totalSteps}`);
		}
	}

	function goToNextStep() {
		if (currentStepIndex < totalSteps - 1) {
			currentStepIndex++;
			showStep(currentStepIndex);
		}
	}

	$form.on('click', nextButtonSelector, function(e) {
		e.preventDefault();
		goToNextStep();
	});

	stepSelectors.forEach((selector, i) => {
		$(selector).hide().attr('aria-hidden', 'true');
	});

	showStep(0);
}


$(document).ready(function() {
  initializeMultiStepForm(
    '#multiStepForm',
    ['#step1', '#step2', '#step3'],
    '.next-btn',
    '.step-indicator'
  );
});
