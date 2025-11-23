(function (window, $) {
	'use strict';

	const DEFAULT_RULES = {
		name: {
			required: true,
			minLength: 2,
			maxLength: 50,
			pattern: /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/,
			message: {
				required: 'Это поле обязательно',
				minLength: 'Имя должно содержать минимум 2 символа',
				maxLength: 'Имя слишком длинное',
				pattern: 'Имя не должно содержать цифр или спецсимволов'
			}
		},
		phone: {
			required: true,
			minLength: 11,
			badNumbers: [
				'70000000000',
				'71111111111',
				'72222222222',
				'73333333333',
				'74444444444',
				'75555555555',
				'76666666666',
				'77777777777',
				'78888888888',
				'79999999999'
			],
			message: {
				required: 'Это поле обязательно',
				format: 'Введите правильный номер телефона',
				minLength: 'Введите правильный номер телефона',
				badNumber: 'Недопустимый номер телефона'
			}
		},
		textarea: {
			required: 'Это поле обязательно',
			maxLength: 9999
		},
		email: {
			required: false,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message: {
				required: 'Это поле обязательно',
				pattern: 'Почта введена неправильно'
			}
		},
		link: {
			required: true,
			pattern: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i,
			message: {
				required: 'Это поле обязательно',
				pattern: 'Введите корректную ссылку (например, https://site.ru)'
			}
		},
		price: {
			required: true,
			pattern: /^\d+([.,]\d{1,2})?$/,
			message: {
				required: 'Это поле обязательно',
				pattern: 'Введите корректную цену (например, 199.99)'
			}
		},
		checked: {
			required: true,
			message: {
				required: 'Это поле обязательно'
			}
		},
		personalChecked: {
			required: true,
			message: {
				required: 'Это поле обязательно'
			}
		},
		orgName: {
			required: true,
			minLength: 2,
			maxLength: 1500,
			pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s"«»()\-.,]+$/,
			message: {
				required: 'Это поле обязательно',
				minLength: 'Название должно содержать минимум 2 символа',
				maxLength: 'Название слишком длинное',
				pattern: 'Название содержит недопустимые символы'
			}
		},
		inn: {
			required: true,
			pattern: /^(\d{10}|\d{12})$/,
			message: {
				required: 'Это поле обязательно',
				pattern: 'ИНН должен содержать 10 или 12 цифр'
			}
		},
		width: {
			required: true,
			pattern: /^\d+([.,]\d+)?$/,
			message: {
				required: 'Укажите ширину',
				pattern: 'Ширина должна быть числом (целым или с дробью)'
			}
		},
		height: {
			required: true,
			pattern: /^\d+([.,]\d+)?$/,
			message: {
				required: 'Укажите высоту',
				pattern: 'Высота должна быть числом (целым или с дробью)'
			}
		},
		length: {
			required: true,
			pattern: /^\d+([.,]\d+)?$/,
			message: {
				required: 'Укажите длину',
				pattern: 'Длина должна быть числом (целым или с дробью)'
			}
		}
	};
	function showValid($input) {
		const name = $input.attr('name');
		if (!name) return;

		clearError($input);
		$input.addClass('has-valid');
	}
	
	function showError($input, message) {
		const name = $input.attr('name');
		if (!name) return;
		
		$input.closest('form').find(`.error-${name}`).text(message || '');
		$input.removeClass('has-valid');
		$input.addClass('has-error');
	}
	
	function clearError($input) {
		const name = $input.attr('name');
		if (!name) return;

		$input.closest('form').find(`.error-${name}`).text('');
		$input.removeClass('has-error');
		$input.removeClass('has-valid');
	}
	
	function getDigits(str) {
		return str.replace(/\D/g, '');
	}
	
	function runValidation($input, rules) {
		const val = $input.val().trim();
		const isRequired = $input.prop('required') || rules.required;

		if ($input.attr('type') === 'checkbox') {
			if (isRequired && !$input.is(':checked')) {
				return { isValid: false, message: rules.message.required || 'Это поле обязательно' };
			}
			return { isValid: true, message: null };
		}

		if (!isRequired && val === '') {
			return { isValid: true, message: null };
		}

		if (isRequired && val === '') {
			return { isValid: false, message: rules.message.required || 'Это поле обязательно' };
		}

		if (rules.pattern && !rules.pattern.test(val)) {
			return { isValid: false, message: rules.message.pattern };
		}

		if (rules.minLength && val.length < rules.minLength) {
			return { isValid: false, message: rules.message.minLength || `Минимум ${rules.minLength} символов` };
		}

		if (rules.maxLength && val.length > rules.maxLength) {
			return { isValid: false, message: rules.message.maxLength || `Максимум ${rules.maxLength} символов` };
		}

		if (rules.badNumbers) {
			const digits = getDigits(val);
			if (digits.length !== 11) {
				return { isValid: false, message: rules.message.format };
			}
			
			let normalized = digits;
			if (normalized[0] === '8') normalized = '7' + normalized.slice(1);
			else if (normalized[0] !== '7') {
				return { isValid: false, message: rules.message.format };
			}
			
			if (rules.badNumbers.includes(normalized)) {
				return { isValid: false, message: rules.message.badNumber };
			}
		}

		return { isValid: true, message: null };
	}
	
	function initFormValidation(
		formSelector,
		customRules = {},
		onSuccess,
		validateOnChange = true
	) {
		const $form = $(formSelector);
		if (!$form.length) return;
		
		const rules = { ...DEFAULT_RULES, ...customRules };
		
		$form.find('input[data-validate="phone"]').mask('+7 (000) 000-00-00', {
			clearIfNotMatch: false
		});
		
		$form.on('focus', 'input', function () {
			clearError($(this));
		});
		
		if (validateOnChange) {
			$form.on('blur', 'input[data-validate]', function () {
				const $input = $(this);
				const type = $input.data('validate');
				const fieldRules = rules[type];
				
				if (!fieldRules) {
					return;
				}
				
				const result = runValidation($input, fieldRules);
				
				if (result.isValid) {
					showValid($input);
				} else {
					showError($input, result.message);
				}
			});
		}
		
		$form.on('submit', function (e) {
			e.preventDefault();
			
			let isValid = true;
			const $inputs = $form.find('input[data-validate]');
			
			$inputs.each(function () {
				const $input = $(this);
				const type = $input.data('validate');
				const fieldRules = rules[type];
				
				if (!fieldRules) {
					return;
				}
				
				const result = runValidation($input, fieldRules);
				
				if (!result.isValid) {
					showError($input, result.message);
					isValid = false;
				} else {
					clearError($input);
					showValid($input);
				}
			});
			
			if (isValid) {
				$form.trigger('form:valid');
				if (typeof onSuccess === 'function') {
					onSuccess($form);
				}
			}
		});
	}

	window.FormValidation = {
		init: initFormValidation
	};
	
	$(function() {
		FormValidation.init('.application_form', {}, function () {
			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.application_form_2', {}, function () {
			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.application_form_3', {}, function () {
			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.risk_form', {}, function () {
			window.modalManager.open('thanks_modal');
		});
		
		FormValidation.init('.calculator_form', {}, function($form) {
			const overdueValue = document.querySelector( 'input[name="overdue"]:checked' ).value;
			
			const debtAmount = parseInt( document.getElementById( 'debtSlider' ).value );
			
			const debtTypes = Array.from( document.querySelectorAll( '.calculator_checkbox-group input[type="checkbox"]:checked' ) )
				.map( cb => cb.value );
			
			const paymentValue = document.querySelector( 'input[name="payment"]:checked' ).value;
			
			const socialTariffChecked = document.querySelector( 'input[name="social_tariff"]:checked' ) !== null;
			
			const formData = new FormData( $form[0] );
			const formValues = Object.fromEntries( formData.entries() );
			
			const fullData = {
				...formValues,
				overdue: overdueValue,
				debtAmount: debtAmount,
				debtTypes: debtTypes,
				payment: paymentValue,
				socialTariff: socialTariffChecked,
			};
			console.log('fullData: ', fullData)
			
			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.ask_questions_modal', {}, function () {
			window.modalManager.close();

			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.help_section_form', {}, function () {
			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.document_form', {}, function () {
			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.vacancies_form', {}, function () {
			window.modalManager.open('thanks_modal');
		});

		FormValidation.init('.consultation_modal_form', {}, function () {
			window.modalManager.open('thanks_modal');
		});
	});
})(window, jQuery);
