import { requireRole } from "@/lib/core/session";


const SellerLayout = async({children}) => {
    await requireRole("seller")
 return <>{children}</>;
}
export default SellerLayout;