import IndexFAQ from "../views/eric/IndexFAQ.vue"
import ShopLogin from "../views/eric/ShopLogin.vue"
import SellerSigup from "../views/eric/SellerSigup.vue"
import UserLogin from "../views/eric/UserLogin.vue"

// 這邊本來有的寫FAQ有的寫FAQ,統一改成FAQ 
export default [
    {path: '/FAQ', name: 'IndexFAQ', component: IndexFAQ},
    {path: '/ShopLogin', name: 'ShopLogin',component: ShopLogin},
    {path: '/SellerSigup', name: 'SellerSigup',component: SellerSigup},
    {path: "/UserLogin" , name: "UserLogin", component: UserLogin}

]