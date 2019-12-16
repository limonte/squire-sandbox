import htmlToText from 'html-to-text'

export default class Str {
  public static asEscapedHtml = (text: string) => {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\n/g, '<br />');
  }

  public static htmlToText = (html: string): string => {
    return htmlToText.fromString(html, {
      ignoreImage: true,
      ignoreHref: true,
      wordwrap: false
    });
  }
}