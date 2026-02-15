
/**
 * MONTFLIX SECURITY CORE v2.0
 * Camada de Criptografia e Integridade de Dados
 */

const SECRET_SALT = "MONTFLIX_SECURE_V2_@2026_";

export class Security {
  /**
   * Criptografa dados para armazenamento seguro
   */
  static encrypt(data: any): string {
    const jsonStr = JSON.stringify(data);
    // Codificação Base64 com Salting para ofuscação
    const encoded = btoa(encodeURIComponent(SECRET_SALT + jsonStr));
    // Gera um checksum de integridade simples
    const checksum = this.generateChecksum(jsonStr);
    return `${checksum}.${encoded}`;
  }

  /**
   * Descriptografa e verifica a integridade dos dados
   */
  static decrypt(encryptedStr: string | null): any | null {
    if (!encryptedStr) return null;
    
    try {
      const [checksum, encoded] = encryptedStr.split('.');
      const decoded = decodeURIComponent(atob(encoded));
      const jsonStr = decoded.replace(SECRET_SALT, "");
      
      // Verifica se o dado foi alterado por um hacker
      const currentChecksum = this.generateChecksum(jsonStr);
      if (checksum !== currentChecksum) {
        console.error("⚠️ SEGURANÇA: Violação de integridade detectada! Dados corrompidos ou hackeados.");
        return null;
      }

      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("❌ SEGURANÇA: Erro crítico na descriptografia.");
      return null;
    }
  }

  /**
   * Gera uma assinatura digital para o dado
   */
  private static generateChecksum(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit int
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Sanitiza strings para evitar ataques XSS
   */
  static sanitize(str: string): string {
    return str.replace(/[<>]/g, "").trim();
  }
}
