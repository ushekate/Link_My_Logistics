import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
// import { orders } from "@/constants/orders";
import { Truck } from "lucide-react";
import { useState } from "react";

export default function Form({ setOrder, setMovements }) {
	const { data: orders } = useCollection('cfs_orders', {
		expand: 'cfs'
	});
	console.log(orders);
	const { data: movements } = useCollection('cfs_order_movement', {
		expand: 'order'
	});

	const [formData, setFormData] = useState({
		igm: '',
		bl: '',
		boe: '',
		orderId: '',
	});


	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleTrack = () => {
		console.log(orders);
		const filtered = orders.find(order => {
			let matchesIGM = false, matchesBL = false, matchesBOE = false, matchesOrderId = false;

			if (formData.igm !== '') {
				matchesIGM = order.igmNo === formData.igm;
			}
			if (formData.bl !== '') {
				matchesBL = order.blNo === formData.bl;
			}
			if (formData.boe !== '') {
				matchesBOE = order.boeNo === formData.boe;
			}
			if (formData.orderId !== '') {
				matchesOrderId = order.id === formData.orderId;
			}
			return matchesIGM || matchesBL || matchesBOE || matchesOrderId;
		});
		if (filtered?.id) {
			setMovements(movements.filter((movement) => movement?.order === filtered?.id))
			setOrder(filtered);
		} else {
			setOrder({})
		}
	};

	return (
		<div className="md:m-6 block items-center border border-green-900 rounded-lg bg-[var(--accent)] shadow-md shadow-foreground/40">
			<div className="p-5">
				<h1 className="text-2xl font-semibold">Container Tracking</h1>
			</div>
			<div className="p-2 grid md:grid-cols-2 grid-cols-1 text-black">
				<div className="mx-3 my-2">
					<Label className="text-foreground" title={'IGM Number'} />
					<Input
						placeholder='Enter IGM Number'
						name="igm"
						value={formData.igm}
						onChange={handleChange}
					/>
				</div>
				<div className="mx-3 my-2">
					<Label className="text-foreground" title={'BL Number'} />
					<Input
						placeholder='Enter BL Number'
						name="bl"
						value={formData.bl}
						onChange={handleChange}
					/>
				</div>
				<div className="mx-3 my-2">
					<Label className="text-foreground" title={'BOE Number'} />
					<Input
						placeholder='Enter BOE Number'
						name="boe"
						value={formData.boe}
						onChange={handleChange}
					/>
				</div>
				<div className="mx-3 my-2">
					<Label className="text-foreground" title={'Order Id'} />
					<Input
						placeholder='Enter Order Id'
						name="orderId"
						value={formData.orderId}
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className="p-5 flex justify-end">
				<Button
					className="rounded-[6px]"
					icon={<Truck />}
					title={'Track Status'}
					onClick={handleTrack}
				/>
			</div>
		</div>
	)
}

