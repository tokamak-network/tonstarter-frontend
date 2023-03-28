import {Projects, } from '@Launch/types';


function validateSimplifiedFormikValues(
    values: Projects['CreateSimplifiedProject']
) {
    const fields: any[] = [];    
   const vaults = values.vaults.map((vault: any) => {
    if (vault.vaultTokenAllocation === undefined) {
        console.log('vault',vault);
        
        fields.push(false)
    }
    else {
        fields.push(true)
    }
   })

   const others = Object.values(values).map((val:any) => {
    if (val === undefined) {
        fields.push(false)
    }
    else {
        fields.push(true)
    }
   })
   console.log('fields',fields);
   
   const results = fields.filter((field: boolean) => field===false)
   
   return results.length> 0? false: true
   
   
}

export default validateSimplifiedFormikValues;