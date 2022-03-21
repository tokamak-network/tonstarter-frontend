function getFormikName(name: string): string {
  switch (name) {
    case 'Public Round 1':
      return 'publicRound1';
    default:
      return '';
  }
}

export default getFormikName;
