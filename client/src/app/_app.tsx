import { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const App =({Component,pageProps}:AppProps)=>{
    return (
        <QueryClientProvider client = {queryClient}>
           <Component {...pageProps}/>
        </QueryClientProvider>
    )
}
export default App
