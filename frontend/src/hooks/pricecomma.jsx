export default function PriceComma({ value }) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}