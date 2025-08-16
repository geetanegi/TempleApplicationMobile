const colors = {
  primary: '#FB8C46',
  accent: '#FFE8D9',
  secondary: '#323A52',
  linearGradient: ["#FB9246", "#FBBF48"],
  title: '#333333',
  text: '#011947',
  background: '#FFFFFF',
};

 const customStyles= {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: colors.title,
    fontFamily: 'Rubik-Bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputBox: {
    height: 70,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: colors.secondary,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'Rubik-Regular',
  },
  caption: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Rubik-Regular',
  },
  darkButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: colors.secondary,
  },
  mediumText: {
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
  },
  lightText: {
    fontSize: 14,
    opacity: 0.8,
    fontFamily: 'Rubik-Regular',
  },
  fontLight: {
    fontFamily: 'Rubik-Light',
  },
  fontRegular: {
    fontFamily: 'Rubik-Regular',
  },
  fontMedium: {
    fontFamily: 'Rubik-Medium',
  },
  fontBold: {
    fontFamily: 'Rubik-Bold',
  },
  colorPrimary: {
    color: colors.primary,
  },
  colorSecondary: {
    color: colors.secondary,
  },
  colorAccent: {
    color: colors.accent,
  },
  linearGradient: {
    background: `linear-gradient(45deg, ${colors.linearGradient[0]}, ${colors.linearGradient[1]})`,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textTransform: 'uppercase',
    fontFamily: 'Rubik-Medium',
    textAlign: 'center',
    width: '100%',
  },
  flexRow: {
    flexDirection: 'row',}

}

export { colors,customStyles };

