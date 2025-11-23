function formatDebtAmount(value) {
	const formattedValue = Number(value).toLocaleString('ru-RU');
	return `${formattedValue} ₽`;
}

const slider = document.getElementById('debtSlider');
const display = document.getElementById('debtAmountDisplay');

function updateDebtDisplay() {
	const value = slider.value;
	display.textContent = formatDebtAmount(value);
}

updateDebtDisplay();

slider.addEventListener('input', updateDebtDisplay);


function initCustomSlider() {
	const input = document.getElementById('debtSlider');
	const track = document.getElementById('debtSliderCustom');
	const progress = document.getElementById('sliderProgress');
	const thumb = document.getElementById('sliderThumb');
	const display = document.getElementById('debtAmountDisplay');
	
	const MIN_VALUE = 0;
	const MAX_VALUE = 2000000;

	function updateCustomSlider() {
		const value = parseInt(input.value);
		const percent = ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;
		progress.style.width = `${percent}%`;
		thumb.style.left = `${percent}%`;
		display.textContent = formatDebtAmount(value);
	}

	input.addEventListener('input', updateCustomSlider);

	updateCustomSlider();

	function getValueFromClick(e) {
		const rect = track.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const percent = Math.max(0, Math.min(1, offsetX / rect.width));
		let value = Math.round(percent * (MAX_VALUE - MIN_VALUE) + MIN_VALUE);
		value = Math.round(value / 1000) * 1000;
		return Math.max(MIN_VALUE, Math.min(MAX_VALUE, value));
	}

	track.addEventListener('click', (e) => {
		const value = getValueFromClick(e);
		input.value = value;
		updateCustomSlider();
		updateResults();
	});

	let isDragging = false;
	
	thumb.addEventListener('mousedown', (e) => {
		isDragging = true;
		e.preventDefault();
	});
	
	document.addEventListener('mousemove', (e) => {
		if (!isDragging) return;
		const value = getValueFromClick(e);
		input.value = value;
		updateCustomSlider();
	});
	
	document.addEventListener('mouseup', () => {
		if (isDragging) {
			updateResults();
		}
		isDragging = false;
	});
}

initCustomSlider();


function createSliderMarks() {
	const container = document.getElementById('sliderMarks');
	container.innerHTML = '';
	
	const marks = [0, 500000, 1000000, 1500000, 2000000];
	const slider = document.getElementById('debtSlider');

	const sliderRect = slider.getBoundingClientRect();
	const sliderWidth = sliderRect.width;

	marks.forEach(value => {
		const mark = document.createElement('div');
		mark.classList.add('slider-mark');

		const percent = (value / slider.max) * 100;

		mark.style.left = `${percent}%`;
		mark.style.transform = 'translateX(-50%)';
		
		container.appendChild(mark);
	});
}

createSliderMarks();

window.addEventListener('resize', createSliderMarks);


function updateResults() {

	const overdueValue = document.querySelector('input[name="overdue"]:checked').value;

	const debtAmount = parseInt(document.getElementById('debtSlider').value);

	const debtTypes = Array.from(document.querySelectorAll('.calculator_checkbox-group input[type="checkbox"]:checked'))
		.map(cb => cb.value);

	const paymentValue = document.querySelector('input[name="payment"]:checked').value;

	const socialTariffChecked = document.querySelector('input[name="social_tariff"]:checked') !== null;

	let basePrice = 150500;
	let resultSum = basePrice;
	
	if (debtAmount > 1000000) {
		resultSum += 50000;
	}
	if (overdueValue !== 'none') {
		resultSum += 20000;
	}
	if (debtTypes.length > 3) {
		resultSum += 10000;
	}

	if (socialTariffChecked) {
		resultSum -= 10000;
	}

	const benefit = debtAmount - resultSum;

	let months = 8;
	if (paymentValue === 'payment_4m') months = 4;
	if (paymentValue === 'payment_6m') months = 6;
	if (paymentValue === 'full_payment') months = 1;
	
	const monthlyPrice = months > 1 ? (resultSum / months).toFixed(0) : resultSum;

	document.getElementById('resultSum1').textContent = formatDebtAmount(resultSum);
	document.getElementById('resultSum2').textContent = formatDebtAmount(resultSum);
	document.getElementById('resultDebtAmount').textContent = formatDebtAmount(debtAmount);
	document.getElementById('resultBenefit').textContent = formatDebtAmount(benefit);
	document.getElementById('resultMonthlyPrice').textContent = months > 1
		? `${formatDebtAmount(monthlyPrice)}/мес.`
		: `${formatDebtAmount(monthlyPrice)}`;
}

document.getElementById('debtSlider').addEventListener('input', updateResults);

document.querySelectorAll('input[name="overdue"]').forEach(radio => {
	radio.addEventListener('change', updateResults);
});

document.querySelectorAll('.calculator_checkbox-group input[type="checkbox"]').forEach(checkbox => {
	checkbox.addEventListener('change', updateResults);
});

document.querySelectorAll('input[name="payment"]').forEach(radio => {
	radio.addEventListener('change', updateResults);
});

document.querySelector('input[name="social_tariff"]').addEventListener('change', updateResults);

updateResults();