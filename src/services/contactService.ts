/**
 * Contact Form Service
 * Handles communication with the backend API for contact form submissions
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  interestPower: string;
  currentBill: string;
  notes: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Submit contact form to backend API
 * @param formData - The contact form data to submit
 * @returns Promise with response from backend
 */
export async function submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao enviar formulário');
    }

    return {
      success: true,
      message: data.message || 'Formulário enviado com sucesso!',
      data: data,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'Erro ao enviar formulário',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Validate contact form data
 * @param formData - The contact form data to validate
 * @returns Object with validation errors (empty if valid)
 */
export function validateContactForm(formData: ContactFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.name?.trim()) {
    errors.name = 'Nome é obrigatório';
  }

  if (!formData.email?.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Telefone é obrigatório';
  }

  if (!formData.company?.trim()) {
    errors.company = 'Empresa é obrigatória';
  }

  return errors;
}

/**
 * Simple email validation
 * @param email - Email to validate
 * @returns True if email is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
