// src/theme/styles.ts
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const theme = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSmall: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  // Tipografía
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 11,
    color: colors.textLight,
  },

  // Botones
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnSecondary: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  btnDanger: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  btnSuccess: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },

  // Inputs
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  // Chips
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.textWhite,
  },

  // Separadores
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },

  // Badges
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
});

export { colors };
