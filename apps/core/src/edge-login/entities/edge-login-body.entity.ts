import { IsString } from 'class-validator';

export class EdgeLoginBody {
  /**
   * @example "user"
   */
  @IsString()
  public readonly username: string;

  /**
   * @example "password"
   */
  @IsString()
  public readonly password: string;

  /**
   * @example "linux"
   */
  @IsString()
  public readonly authMechanism: string;
}
