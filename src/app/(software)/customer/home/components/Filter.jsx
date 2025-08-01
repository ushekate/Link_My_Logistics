import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RangeSlider from '@/components/ui/Range';
import {
    Select,
    SelectItem,
} from '@/components/ui/Select';
import { useState } from 'react';

const minTariffValues = {
	min: 5000,
	max: 10000,
}

const maxTariffValues = {
	min: 10000,
	max: 15000,
}

const minFreeDays = {
	min: 7,
	max: 14,
}

const maxFreeDays = {
	min: 14,
	max: 30,
}

const minContainers = {
	min: 1,
	max: 20,
}

const maxContainers = {
	min: 20,
	max: 50,
}

export function FilterCFS({ openDialog, onFilterChange }) {
	// State variables for filter values
	const [placeType, setPlaceType] = useState('Tariff Rates');
	const [tariffPriceRange, setTariffPriceRange] = useState({ min: minTariffValues.min, max: minTariffValues.max });
	const [freeDays, setFreeDays] = useState('7 Days');
	const [freeDaysRange, setFreeDaysRange] = useState({ min: minFreeDays.min, max: maxFreeDays.min });
	const [containers, setContainers] = useState({ min: minContainers.min, max: minContainers.max })

	// Handlers for updating filter values
	const handlePlaceTypeChange = (type) => setPlaceType(type);

	// Tariff Range Changer
	const handlePriceChange = (e, type) => {
		let value = e.target.value;
		if (value !== '') {
			value = parseInt(value)
			switch (type) {
				case 'max':
					value = value >= maxTariffValues.min && value <= maxTariffValues.max ? value : maxTariffValues.min
					break;

				default:
					value = value >= minTariffValues.min && value <= minTariffValues.max ? value : minTariffValues.min
					break;
			}
		}
		setTariffPriceRange((prev) => ({
			...prev,
			[type]: value,
		}));
	};

	// Free Days Range Changer
	const handleFreeDaysRange = (e, type) => {
		let value = e.target.value;
		if (value !== '') {
			value = parseInt(value)
			switch (type) {
				case 'max':
					value = value >= maxFreeDays.min && value <= maxFreeDays.max ? value : maxFreeDays.min
					break;

				default:
					value = value >= minFreeDays.min && value <= minFreeDays.max ? value : minFreeDays.min
					break;
			}
		}
		setFreeDaysRange((prev) => ({
			...prev,
			[type]: value,
		}));
	};

	// Containers Range Changer
	const handleContainers = (e, type) => {
		let value = e.target.value;
		if (value !== '') {
			value = parseInt(value)
			switch (type) {
				case 'max':
					value = value >= maxContainers.min && value <= maxContainers.max ? value : maxContainers.min
					break;

				default:
					value = value >= minContainers.min && value <= minContainers.max ? value : minContainers.min
					break;
			}
		}
		setContainers((prev) => ({
			...prev,
			[type]: value,
		}));
	};

	const handleClearAll = () => {
		setPlaceType('Tariff Rates');
		setFreeDays('7 Days');
		setTariffPriceRange({ min: minTariffValues.min, max: minTariffValues.max });
		setFreeDaysRange({ min: minFreeDays.min, max: maxFreeDays.min });
		setContainers({ min: minContainers.min, max: minContainers.max });
	};

	return (
		<div className="md:p-6">
			{/* Type of Place */}
			<div className="mb-6">
				<div className="grid md:grid-cols-4 grid-cols-1 gap-4">
					{['Tariff Rates', 'Free Days', 'Free Days Range', 'Containers'].map((type) => (
						<button
							key={type}
							onClick={() => handlePlaceTypeChange(type)}
							className={`px-4 py-2 rounded-full border-2 cursor-pointer
									${placeType === type ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]' : ''
								}`}
						>
							{type}
						</button>
					))}
				</div>
			</div>

			{/* Tariff Rates */}
			{
				placeType === 'Tariff Rates' && (
					<div className="mb-6">
						<h3 className="text-sm font-medium mb-3">Price range</h3>
						<div className="flex gap-4">
							<RangeSlider
								value={tariffPriceRange.min}
								onChange={(e) => handlePriceChange(e, 'min')}
								min={minTariffValues.min}
								max={minTariffValues.max}
							/>
							<RangeSlider
								value={tariffPriceRange.max}
								onChange={(e) => handlePriceChange(e, 'max')}
								min={maxTariffValues.min}
								max={maxTariffValues.max}
							/>
						</div>
						<div className="flex justify-between mt-3">
							<div>
								<label className="text-sm text-gray-600">Minimum (₹)</label>
								<Input
									type='number'
									value={tariffPriceRange.min}
									onChange={(e) => handlePriceChange(e, 'min')}
									min={minTariffValues.min}
									max={minTariffValues.max}
								/>
							</div>
							<div>
								<label className="text-sm text-gray-600">Maximum (₹)</label>
								<Input
									type='number'
									value={tariffPriceRange.max}
									onChange={(e) => handlePriceChange(e, 'max')}
									min={maxTariffValues.min}
									max={maxTariffValues.max}
								/>
							</div>
						</div>
					</div>
				)
			}

			{/* Free Days */}
			{
				placeType === 'Free Days' && (
					<div>
						<label className="text-sm">Max No. of Free Days</label>
						<Select value={freeDays} onValueChange={setFreeDays}>
							<SelectItem value="7">7 Days</SelectItem>
							<SelectItem value="10">10 Days</SelectItem>
							<SelectItem value="14">14 Days</SelectItem>
						</Select>
					</div>
				)
			}

			{/* Free Days Range */}
			{
				placeType === 'Free Days Range' && (
					<div className="mb-6">
						<h3 className="text-sm font-medium mb-3">Free Days range</h3>
						<div className="flex gap-4">
							<RangeSlider
								value={freeDaysRange.min}
								onChange={(e) => handleFreeDaysRange(e, 'min')}
								min={minFreeDays.min}
								max={minFreeDays.max}
							/>
							<RangeSlider
								value={freeDaysRange.max}
								onChange={(e) => handleFreeDaysRange(e, 'max')}
								min={maxFreeDays.min}
								max={maxFreeDays.max}
							/>
						</div>
						<div className="flex justify-between mt-3">
							<div>
								<label className="text-sm text-gray-600">Minimum (Days)</label>
								<Input
									type='number'
									value={freeDaysRange.min}
									onChange={(e) => handleFreeDaysRange(e, 'min')}
									min={minFreeDays.min}
									max={minFreeDays.max}
								/>
							</div>
							<div>
								<label className="text-sm text-gray-600">Maximum (Days)</label>
								<Input
									type='number'
									value={freeDaysRange.max}
									onChange={(e) => handleFreeDaysRange(e, 'max')}
									min={maxFreeDays.min}
									max={maxFreeDays.max}
								/>
							</div>
						</div>
					</div>
				)
			}

			{/* Containers */}
			{
				placeType === 'Containers' && (
					<div className="mb-6">
						<h3 className="text-sm font-medium mb-3">Quantity range</h3>
						<div className="flex gap-4">
							<RangeSlider
								value={containers.min}
								onChange={(e) => handleContainers(e, 'min')}
								min={minContainers.min}
								max={minContainers.max}
							/>
							<RangeSlider
								value={containers.max}
								onChange={(e) => handleContainers(e, 'max')}
								min={maxContainers.min}
								max={maxContainers.max}
							/>
						</div>
						<div className="flex justify-between mt-3">
							<div>
								<label className="text-sm text-gray-600">Minimum</label>
								<Input
									type='number'
									value={containers.min}
									onChange={(e) => handleContainers(e, 'min')}
									min={minContainers.min}
									max={minContainers.max}
								/>
							</div>
							<div>
								<label className="text-sm text-gray-600">Maximum</label>
								<Input
									type='number'
									value={containers.max}
									onChange={(e) => handleContainers(e, 'max')}
									min={maxContainers.min}
									max={maxContainers.max}
								/>
							</div>
						</div>
					</div>
				)
			}


			{/* Buttons */}
			<div className="flex items-center justify-between mt-10">
				<Button
					onClick={handleClearAll}
					title={'Clear all'}
					variant={'outline'}
					className='rounded-xl'
				/>

				<Button
					onClick={() => {
						// Pass filter values to parent component
						if (onFilterChange) {
							onFilterChange({
								placeType,
								tariffPriceRange,
								freeDays,
								freeDaysRange,
								containers
							});
						}
						openDialog(false);
					}}
					title={'Show Providers'}
					className='rounded-xl'
				/>
			</div>
		</div>
	);
}
