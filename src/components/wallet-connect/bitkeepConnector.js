import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

function parseSendReturn(sendReturn) {
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on (window as any).bitkeep.ethereum.'
  }
}

export  class UserRejectedRequestError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export  class BitKeepConnector extends AbstractConnector {
  constructor(kwargs) {
    super(kwargs)
  }

  async activate() {
    
    const bitkeep = window.bitkeep;
    if (bitkeep) {
      // try to activate + get account via eth_requestAccounts
      let account
      try {
        await bitkeep.ethereum.request({ method: 'eth_requestAccounts' });
        account = await bitkeep.ethereum.request({ method: 'eth_requestAccounts' }).then(
          sendReturn => parseSendReturn(sendReturn)[0]
        )
      } catch (error) {
        if (error.code === 4001) {
          throw new UserRejectedRequestError()
        }
        warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
      }

      // if unsuccessful, try enable
      if (!account) {
        // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
        account = await bitkeep.ethereum.enable().then((sendReturn) => sendReturn && parseSendReturn(sendReturn)[0])
      }

      return { provider: bitkeep.ethereum, ...(account ? { account } : {}) }
      } else {
      window.open("https://bitkeep.com/download", "_blank");
      throw new Error('No Bitkeep wallet found');
    }
  }

  async getProvider() {
    return window.bitkeep.ethereum
  }

  async getChainId() {
    if (!(window.bitkeep.ethereum)) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await (window.bitkeep.ethereum.request)('eth_chainId').then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await (window.bitkeep.ethereum.send)('net_version').then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      try {
        chainId = parseSendReturn((window.bitkeep.ethereum.send)({ method: 'net_version' }))
      } catch {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }

    if (!chainId) {
      if (window.bitkeep.ethereum.isDapper) {
        chainId = parseSendReturn(window.bitkeep.ethereum.cachedResults.net_version)
      } else {
        chainId =
          (window.bitkeep.ethereum).chainId ||
          (window.bitkeep.ethereum).netVersion ||
          (window.bitkeep.ethereum).networkVersion ||
          (window.bitkeep.ethereum)._chainId
      }
    }

    return chainId
  }

  async getAccount() {
    if (!window.bitkeep.ethereum) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await (window.bitkeep.ethereum.send)('eth_accounts').then(sendReturn => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await window.bitkeep.ethereum.enable().then((sendReturn) => parseSendReturn(sendReturn)[0])
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account) {
      account = parseSendReturn((window.bitkeep.ethereum.send)({ method: 'eth_accounts' }))[0]
    }

    return account
  }

  deactivate() {
  }

  async isAuthorized() {
    if (!window.bitkeep.ethereum) {
      return false
    }

    try {
      return await (window.bitkeep.ethereum.send)('eth_accounts').then(sendReturn => {
        if (parseSendReturn(sendReturn).length > 0) {
          return true
        } else {
          return false
        }
      })
    } catch {
      return false
    }
  }
}