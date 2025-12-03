
// export const TabVariants = cva("",{
//     variants : {
//         default : {
//             mainContainer : "relative flex w-full justify-center",
//             tabContainer : "flex w-full",
//             tabGroup : "",
//             tablist : "flex gap-5",
//             tab : "pb-2 px-1 text-slate-600 text-sm font-medium leading-5 focus:outline-none data-[selected]:border-b-2 border-b-primary-600 data-[selected]:font-bold data-[selected]:text-slate-950",

//         },
//         noBorder :{
//             mainContainer : "",
//             tabContainer : "",
//             tabGroup : "",
//             tablist : "",
//             tab : "",
//         }
//     }
// })

export const TabVariants = {
  default: {
    mainContainer: "relative flex w-full justify-center",
    tabContainer: "flex w-full",
    tabGroup: "",
    tabListGroup: "flex gap-5",
    tab: "pb-2 px-1 text-slate-600 text-sm font-medium leading-5 focus:outline-none data-[selected]:border-b-[3px] border-b-primary-600 data-[selected]:font-bold data-[selected]:text-slate-950",
  },
  dark: {
    mainContainer: "relative flex w-full justify-center",
    tabContainer: "flex w-full",
    tabGroup: "",
    tabListGroup: "flex gap-3",
    tab: "px-2 py-1 text-white text-sm rounded-md font-normal leading-5 focus:outline-none data-[selected]:bg-[#2E2E2E] data-[selected]:font-semibold",
  },
};
