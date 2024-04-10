export const predicates = {
  predicate: {
    abi: {
      types: [
        {
          typeId: 0,
          type: 'b256',
          components: null,
          typeParameters: null,
        },
        {
          typeId: 1,
          type: 'bool',
          components: null,
          typeParameters: null,
        },
        {
          typeId: 2,
          type: 'struct EvmAddress',
          components: [
            {
              name: 'value',
              type: 0,
              typeArguments: null,
            },
          ],
          typeParameters: null,
        },
        {
          typeId: 3,
          type: 'u64',
          components: null,
          typeParameters: null,
        },
      ],
      functions: [
        {
          inputs: [
            {
              name: 'witness_index',
              type: 3,
              typeArguments: null,
            },
          ],
          name: 'main',
          output: {
            name: '',
            type: 1,
            typeArguments: null,
          },
          attributes: null,
        },
      ],
      loggedTypes: [],
      messagesTypes: [],
      configurables: [
        {
          name: 'SIGNER',
          configurableType: {
            name: '',
            type: 2,
            typeArguments: [],
          },
          offset: 1952,
        },
      ],
    },
    bytecode: base64ToUint8Array(
      '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',
    ),
  },
};

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}