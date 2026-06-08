export const downloadFile = (link: string) => {
  const a = document.createElement('a');
  a.href = link;
  a.download = '';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
