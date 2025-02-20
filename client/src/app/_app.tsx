
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const App =({Component,pageProps})=>{
    return (
        <QueryClientProvider client = {queryClient}>
           <Component {...pageProps}/>
        </QueryClientProvider>
    )
}
export default App
