//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const billing_getCatalogItemListV1Eval: EvalFunction = {
    name: 'billing_getCatalogItemListV1 Evaluation',
    description: 'Evaluates the retrieval of the billing catalog item list',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please use the billing_getCatalogItemListV1 endpoint to retrieve all domain items from the billing catalog.");
        return JSON.parse(result);
    }
};

const billing_createNewServiceOrderV1Eval: EvalFunction = {
    name: 'billing_createNewServiceOrderV1 Evaluation',
    description: 'Evaluates the new service order creation functionality',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Create a new service order using payment method ID 123 with an item (item_id: 'abc123', quantity: 2) and apply coupon 'WELCOME10'.");
        return JSON.parse(result);
    }
};

const billing_setDefaultPaymentMethodV1Eval: EvalFunction = {
    name: 'billing_setDefaultPaymentMethodV1 Tool Evaluation',
    description: 'Evaluates the default payment method setting functionality',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Set the payment method with ID 4321 as the default for my account.");
        return JSON.parse(result);
    }
};

const billing_deletePaymentMethodV1Eval: EvalFunction = {
    name: 'billing_deletePaymentMethodV1 Tool Evaluation',
    description: 'Evaluates the deletion of a payment method from an account',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please delete the payment method with ID 123 from my billing account and show the remaining payment methods.");
        return JSON.parse(result);
    }
};

const billing_getPaymentMethodListV1Eval: EvalFunction = {
    name: 'billing_getPaymentMethodListV1 Evaluation',
    description: 'Evaluates the retrieval of available payment methods for placing new orders',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please retrieve the list of available payment methods for placing new orders and verify they can be used at checkout.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [billing_getCatalogItemListV1Eval, billing_createNewServiceOrderV1Eval, billing_setDefaultPaymentMethodV1Eval, billing_deletePaymentMethodV1Eval, billing_getPaymentMethodListV1Eval]
};
  
export default config;
  
export const evals = [billing_getCatalogItemListV1Eval, billing_createNewServiceOrderV1Eval, billing_setDefaultPaymentMethodV1Eval, billing_deletePaymentMethodV1Eval, billing_getPaymentMethodListV1Eval];