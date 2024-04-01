import { IsString } from 'class-validator';

export class EdgeLoginBody {
  /**
   * @example "192.168.0.1"
   */
  @IsString()
  public readonly edgeEndpoint: string;

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
