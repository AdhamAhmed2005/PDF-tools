// lib/payment/arb-gateway.js
// ARB Payment Gateway Integration Helper

import crypto from 'crypto';

// Configuration - Replace with your actual credentials
const config = {
  resourceKey: process.env.ARB_RESOURCE_KEY || 'your-resource-key',
  merchantId: process.env.ARB_MERCHANT_ID || 'your-merchant-id',
  password: process.env.ARB_PASSWORD || 'your-password',
  apiUrl: process.env.ARB_API_URL || 'https://arb-payment-gateway.com/api',
  iv: 'PGKEYENCDECIVSPC', // Initialization vector from documentation
};

/**
 * Encrypt data using AES-256-CBC with PKCS5 padding
 */
function encryptAES(data, key) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf8').slice(0, 32), config.iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypt data using AES-256-CBC
 */
function decryptAES(encryptedData, key) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf8').slice(0, 32), config.iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

/**
 * Generate Payment Token from ARB Payment Gateway
 */
export async function generatePaymentToken(orderData) {
  const {
    amount,
    trackId,
    currencyCode = '682', // SAR - Saudi Riyal
    responseURL,
    errorURL,
    udf1,
  } = orderData;

  // Prepare transaction data according to ARB documentation
  const tranData = {
    amt: amount.toFixed(2),
    action: '1', // 1 - Purchase, 4 - Authorization
    password: config.password,
    id: config.merchantId,
    currencyCode,
    trackId,
    responseURL,
    errorURL,
    udf1: udf1 || '',
  };

  // Encrypt transaction data with AES
  const encryptedData = encryptAES(tranData, config.resourceKey);

  try {
    // Call ARB Payment Gateway Token Generation API
    const response = await fetch(`${config.apiUrl}/payment/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tranData: encryptedData,
        resourceKey: config.resourceKey,
      }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return {
        success: true,
        paymentId: result.paymentId,
        paymentUrl: result.paymentUrl,
      };
    } else {
      return {
        success: false,
        errorCode: result.errorCode,
        errorDescription: result.errorDescription,
      };
    }
  } catch (error) {
    console.error('ARB Payment Gateway Error:', error);
    return {
      success: false,
      errorCode: 'API_ERROR',
      errorDescription: error.message,
    };
  }
}

/**
 * Verify Transaction Status from ARB Payment Gateway
 */
export async function verifyTransactionStatus(paymentId, trackId) {
  try {
    const response = await fetch(`${config.apiUrl}/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        trackId,
        merchantId: config.merchantId,
        resourceKey: config.resourceKey,
      }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return {
        success: true,
        transactionStatus: result.transactionStatus,
        amount: result.amount,
        paymentId: result.paymentId,
        trackId: result.trackId,
        authorizationCode: result.authorizationCode,
        transactionDate: result.transactionDate,
      };
    } else {
      return {
        success: false,
        errorCode: result.errorCode,
        errorDescription: result.errorDescription,
      };
    }
  } catch (error) {
    console.error('Transaction Status Verification Error:', error);
    return {
      success: false,
      errorCode: 'VERIFICATION_ERROR',
      errorDescription: error.message,
    };
  }
}

/**
 * Generate unique track ID for order
 */
export function generateTrackId() {
  return `TRK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}
